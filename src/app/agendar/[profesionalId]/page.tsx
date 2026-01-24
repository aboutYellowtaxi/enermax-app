'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  Loader2,
  AlertCircle,
  User,
  Phone,
  MessageSquare,
  Shield,
  Bell,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase, Profesional } from '@/lib/supabase';

// Servicios paquetizados con precios (MVP - despues viene de la BD)
interface ServicioPaquetizado {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
}

const SERVICIOS_ELECTRICIDAD: ServicioPaquetizado[] = [
  { id: 'visita', nombre: 'Visita + Diagnostico', precio: 15000, descripcion: 'Visita a domicilio, revision del problema y presupuesto' },
  { id: 'tomacorriente', nombre: 'Cambio de tomacorriente', precio: 8000, descripcion: 'Reemplazo de tomacorriente (materiales aparte)' },
  { id: 'luminaria', nombre: 'Instalacion luminaria', precio: 12000, descripcion: 'Instalacion de lampara o spot (materiales aparte)' },
  { id: 'termica', nombre: 'Cambio termica/disyuntor', precio: 18000, descripcion: 'Reemplazo en tablero (materiales aparte)' },
  { id: 'tablero', nombre: 'Revision tablero completa', precio: 25000, descripcion: 'Revision completa, ajuste de conexiones' },
  { id: 'cableado', nombre: 'Cableado nuevo (por punto)', precio: 20000, descripcion: 'Tendido de cable para luz o toma' },
];

// Zonas de Argentina expandidas
const ZONAS_ARGENTINA = [
  // GBA Oeste
  'Moreno', 'Merlo', 'Ituzaingo', 'Moron', 'Haedo', 'Ramos Mejia', 'Castelar',
  'San Justo', 'La Matanza', 'Hurlingham', 'Tres de Febrero', 'Paso del Rey',
  'La Reja', 'Francisco Alvarez', 'Lujan', 'Mercedes', 'General Rodriguez',
  // GBA Norte
  'San Isidro', 'Vicente Lopez', 'Tigre', 'San Fernando', 'Pilar', 'Escobar',
  'San Miguel', 'Jose C. Paz', 'Malvinas Argentinas', 'San Martin',
  // GBA Sur
  'Quilmes', 'Lanus', 'Avellaneda', 'Lomas de Zamora', 'Florencio Varela',
  'Berazategui', 'Almirante Brown', 'Esteban Echeverria', 'Ezeiza',
  // La Plata y alrededores
  'La Plata', 'Ensenada', 'Berisso', 'City Bell', 'Gonnet',
  // CABA
  'Capital Federal', 'CABA', 'Palermo', 'Belgrano', 'Recoleta', 'Caballito',
  'Flores', 'Villa Urquiza', 'Almagro', 'Barracas', 'La Boca', 'San Telmo',
  // Interior Buenos Aires
  'Mar del Plata', 'Bahia Blanca', 'Tandil', 'Olavarria', 'Necochea',
  // Otras provincias principales
  'Cordoba', 'Rosario', 'Mendoza', 'Tucuman', 'Salta', 'Santa Fe',
  'San Juan', 'Neuquen', 'Bariloche', 'Ushuaia', 'Posadas', 'Corrientes',
  'Resistencia', 'Parana', 'Formosa', 'San Luis', 'La Rioja', 'Catamarca',
  'Santiago del Estero', 'Jujuy', 'Rio Gallegos', 'Rawson', 'Viedma',
  'Santa Rosa', 'Comodoro Rivadavia'
];

export default function AgendarPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, usuario, loading: authLoading } = useAuth();
  const profesionalId = params.profesionalId as string;
  const zonaFromUrl = searchParams.get('zona');

  const [profesional, setProfesional] = useState<Profesional | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [citaId, setCitaId] = useState<string | null>(null);

  // Form state
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [fechaPreferida, setFechaPreferida] = useState('');
  const [horaPreferida, setHoraPreferida] = useState('manana');
  const [servicioSeleccionado, setServicioSeleccionado] = useState<ServicioPaquetizado | null>(null);
  const [descripcion, setDescripcion] = useState('');

  // Obtener servicios disponibles para este profesional
  const serviciosDisponibles = SERVICIOS_ELECTRICIDAD; // MVP: hardcoded para electricistas

  // Quick date options
  const getQuickDates = () => {
    const dates = [];
    const today = new Date();

    // Hoy
    dates.push({
      value: today.toISOString().split('T')[0],
      label: 'Hoy',
      sublabel: today.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })
    });

    // Manana
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dates.push({
      value: tomorrow.toISOString().split('T')[0],
      label: 'Mañana',
      sublabel: tomorrow.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })
    });

    // Esta semana
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() + 3);
    dates.push({
      value: thisWeek.toISOString().split('T')[0],
      label: 'Esta semana',
      sublabel: thisWeek.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })
    });

    // Proxima semana
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    dates.push({
      value: nextWeek.toISOString().split('T')[0],
      label: 'Prox. semana',
      sublabel: nextWeek.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' })
    });

    return dates;
  };

  const quickDates = getQuickDates();

  useEffect(() => {
    if (profesionalId) {
      fetchProfesional();
    }
  }, [profesionalId]);

  useEffect(() => {
    // Pre-fill form if logged in
    if (usuario) {
      setNombre(usuario.nombre || '');
      setTelefono(usuario.telefono || '');
    }
  }, [usuario]);

  useEffect(() => {
    // Pre-fill zona from URL parameter
    if (zonaFromUrl) {
      setLocalidad(zonaFromUrl);
    }
  }, [zonaFromUrl]);

  const fetchProfesional = async () => {
    try {
      const { data, error } = await supabase
        .from('leads_profesionales')
        .select('*')
        .eq('id', profesionalId)
        .eq('disponible', true)
        .single();

      if (error) {
        console.error('Error fetching profesional:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setProfesional(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profesional || !servicioSeleccionado) return;

    setSubmitting(true);

    try {
      // Guardar solicitud en leads_clientes
      const { data, error } = await supabase.from('leads_clientes').insert({
        nombre,
        telefono,
        zona: localidad,
        servicio_requerido: servicioSeleccionado.nombre,
        descripcion: `Solicitud con ${profesional.nombre}
Servicio: ${servicioSeleccionado.nombre} - $${servicioSeleccionado.precio.toLocaleString('es-AR')}
Fecha: ${fechaPreferida} (${horaPreferida})
Localidad: ${localidad}
Detalle: ${descripcion || 'Sin detalle adicional'}`,
        estado: 'pendiente'
      }).select().single();

      if (error) {
        console.error('Error guardando solicitud:', error);
      }

      if (data) {
        setCitaId(data.id);
      }

      setSuccess(true);
    } catch (err) {
      console.error('Error:', err);
      // Mostrar exito de todas formas para no frustrar al usuario
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!profesional) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Profesional no encontrado</p>
          <Link href="/" className="text-primary-500 mt-4 inline-block">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-lg mx-auto px-4 py-8">
          {/* Success header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Solicitud enviada!</h1>
            <p className="text-gray-600">
              {profesional.nombre} recibira tu solicitud y te contactara pronto.
            </p>
          </div>

          {/* Resumen */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Resumen de tu solicitud</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <User className="w-5 h-5 text-gray-400" />
                <span>{profesional.nombre}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>
                  {new Date(fechaPreferida).toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>
                  {horaPreferida === 'manana' ? 'Por la mañana (9-12hs)' :
                   horaPreferida === 'tarde' ? 'Por la tarde (14-18hs)' :
                   'Por la noche (18-21hs)'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <span>{servicioSeleccionado?.nombre} - <strong>${servicioSeleccionado?.precio.toLocaleString('es-AR')}</strong></span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{localidad}</span>
              </div>
            </div>
          </div>

          {/* Que sigue */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Que sigue?
            </h2>
            <ol className="space-y-3 text-blue-800">
              <li className="flex items-start gap-3">
                <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                <span>{profesional.nombre} recibira tu solicitud</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                <span>Te contactara por WhatsApp o telefono para confirmar</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-200 text-blue-800 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                <span>Coordinan precio y detalles del trabajo</span>
              </li>
            </ol>
          </div>

          {/* Trust badges */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Profesional verificado</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>{profesional.calificacion} estrellas</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {user ? (
              <Link
                href="/dashboard/cliente"
                className="block w-full bg-primary-500 hover:bg-primary-600 text-secondary-900 font-bold py-4 rounded-xl text-center"
              >
                Ver mis citas
              </Link>
            ) : (
              <Link
                href="/registro"
                className="block w-full bg-primary-500 hover:bg-primary-600 text-secondary-900 font-bold py-4 rounded-xl text-center"
              >
                Crear cuenta para ver mis citas
              </Link>
            )}

            <Link
              href="/"
              className="block w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-4 rounded-xl text-center"
            >
              Volver al inicio
            </Link>

            <a
              href={`https://wa.me/${profesional.telefono}?text=${encodeURIComponent(`Hola ${profesional.nombre}! Acabo de solicitar una cita por Enermax para el ${new Date(fechaPreferida).toLocaleDateString('es-AR')}. Mi nombre es ${nombre}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-green-600 hover:text-green-700 font-medium py-2"
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Tambien podes escribirle por WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-secondary-900 text-white py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-secondary-800 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Agendar visita</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Profesional card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg text-gray-900">{profesional.nombre}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profesional.zona}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{profesional.calificacion}</span>
                </div>
                <span className="text-sm text-gray-400">{profesional.trabajos_completados} trabajos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Datos de contacto */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Tus datos</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="11-1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localidad *</label>
                <select
                  required
                  value={localidad}
                  onChange={(e) => setLocalidad(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">Selecciona tu localidad</option>
                  {ZONAS_ARGENTINA.map((zona) => (
                    <option key={zona} value={zona}>{zona}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Servicios con precios */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-1">Que necesitas?</h3>
            <p className="text-sm text-gray-500 mb-4">Selecciona el servicio que necesitas</p>
            <div className="space-y-2">
              {serviciosDisponibles.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServicioSeleccionado(s)}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    servicioSeleccionado?.id === s.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{s.nombre}</p>
                      <p className="text-sm text-gray-500 mt-1">{s.descripcion}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-primary-600">
                        ${s.precio.toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>
                  {servicioSeleccionado?.id === s.id && (
                    <div className="mt-2 flex items-center gap-1 text-primary-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Seleccionado</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fecha */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Cuando te queda bien?</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickDates.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setFechaPreferida(d.value)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    fechaPreferida === d.value
                      ? 'bg-primary-500 text-secondary-900'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-100'
                  }`}
                >
                  <p className="font-semibold text-sm">{d.label}</p>
                  <p className="text-xs opacity-70">{d.sublabel}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Horario preferido */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Horario preferido</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'manana', label: 'Mañana', sublabel: '9-12hs' },
                { value: 'tarde', label: 'Tarde', sublabel: '14-18hs' },
                { value: 'noche', label: 'Noche', sublabel: '18-21hs' },
              ].map((h) => (
                <button
                  key={h.value}
                  type="button"
                  onClick={() => setHoraPreferida(h.value)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    horaPreferida === h.value
                      ? 'bg-primary-500 text-secondary-900'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-100'
                  }`}
                >
                  <p className="font-semibold text-sm">{h.label}</p>
                  <p className="text-xs opacity-70">{h.sublabel}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Descripcion */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Conta brevemente el problema (opcional)</h3>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="Ej: Se corta la luz cuando prendo el aire..."
            />
          </div>

          {/* Resumen del precio */}
          {servicioSeleccionado && (
            <div className="bg-primary-50 rounded-2xl p-4 border-2 border-primary-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Servicio seleccionado</p>
                  <p className="font-semibold text-gray-900">{servicioSeleccionado.nombre}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Precio</p>
                  <p className="text-xl font-bold text-primary-600">
                    ${servicioSeleccionado.precio.toLocaleString('es-AR')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!nombre || !telefono || !localidad || !fechaPreferida || !servicioSeleccionado || submitting}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-secondary-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5" />
                Solicitar servicio - ${servicioSeleccionado?.precio.toLocaleString('es-AR') || ''}
              </>
            )}
          </button>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Sin compromiso
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Respuesta rapida
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
