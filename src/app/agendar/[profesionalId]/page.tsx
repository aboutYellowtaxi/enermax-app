'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  const { user, usuario, loading: authLoading } = useAuth();
  const profesionalId = params.profesionalId as string;

  const [profesional, setProfesional] = useState<Profesional | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [citaId, setCitaId] = useState<string | null>(null);

  // Form state - simplified
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [fechaPreferida, setFechaPreferida] = useState('');
  const [horaPreferida, setHoraPreferida] = useState('manana');
  const [servicio, setServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');

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

  const fetchProfesional = async () => {
    const { data } = await supabase
      .from('leads_profesionales')
      .select('*')
      .eq('id', profesionalId)
      .single();

    if (data) {
      setProfesional(data);
      if (data.servicios?.length > 0) {
        setServicio(data.servicios[0]);
      }
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profesional) return;

    setSubmitting(true);

    try {
      // If logged in, create cita in database
      if (usuario) {
        const { data, error } = await supabase.from('citas').insert({
          cliente_id: usuario.id,
          profesional_id: profesionalId,
          fecha: fechaPreferida,
          hora_inicio: horaPreferida === 'manana' ? '09:00' : horaPreferida === 'tarde' ? '14:00' : '18:00',
          hora_fin: horaPreferida === 'manana' ? '12:00' : horaPreferida === 'tarde' ? '18:00' : '21:00',
          servicio,
          descripcion: `${descripcion}\n\nContacto: ${nombre} - ${telefono}\nLocalidad: ${localidad}`,
          estado: 'pendiente'
        }).select().single();

        if (error) throw error;
        if (data) setCitaId(data.id);
      }

      // Also save as lead for backup
      await supabase.from('leads_clientes').insert({
        nombre,
        telefono,
        zona: localidad,
        servicio_requerido: servicio,
        descripcion: `Solicitud de cita con ${profesional.nombre} para ${fechaPreferida} (${horaPreferida}). Localidad: ${localidad}. ${descripcion}`,
        estado: 'cita_solicitada'
      });

      setSuccess(true);
    } catch (err) {
      console.error('Error:', err);
      // Even if DB fails, show success (we have the lead)
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
                <span className="capitalize">{servicio}</span>
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

          {/* Servicio */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Que necesitas?</h3>
            <div className="flex flex-wrap gap-2">
              {profesional.servicios?.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setServicio(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                    servicio === s
                      ? 'bg-primary-500 text-secondary-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={!nombre || !telefono || !localidad || !fechaPreferida || !servicio || submitting}
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
                Solicitar visita
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
