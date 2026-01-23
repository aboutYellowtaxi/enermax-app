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
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase, Profesional, Disponibilidad } from '@/lib/supabase';

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

export default function AgendarPage() {
  const params = useParams();
  const router = useRouter();
  const { user, usuario, loading: authLoading } = useAuth();
  const profesionalId = params.profesionalId as string;

  const [profesional, setProfesional] = useState<Profesional | null>(null);
  const [disponibilidad, setDisponibilidad] = useState<Disponibilidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [servicio, setServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Generate next 14 days
  const [availableDates, setAvailableDates] = useState<{ date: string; label: string; dayOfWeek: number }[]>([]);

  useEffect(() => {
    // Generate dates
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }),
        dayOfWeek: date.getDay()
      });
    }
    setAvailableDates(dates);
  }, []);

  useEffect(() => {
    if (profesionalId) {
      fetchProfesional();
      fetchDisponibilidad();
    }
  }, [profesionalId]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !user) {
      router.push(`/login?redirect=/agendar/${profesionalId}`);
    }
  }, [user, authLoading, router, profesionalId]);

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

  const fetchDisponibilidad = async () => {
    const { data } = await supabase
      .from('disponibilidad')
      .select('*')
      .eq('profesional_id', profesionalId)
      .eq('activo', true);

    if (data) {
      setDisponibilidad(data);
    }
  };

  const getAvailableTimesForDate = (dateStr: string): string[] => {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();

    const dayDisp = disponibilidad.find(d => d.dia_semana === dayOfWeek);
    if (!dayDisp) return [];

    // Generate hourly slots
    const times: string[] = [];
    const startHour = parseInt(dayDisp.hora_inicio.split(':')[0]);
    const endHour = parseInt(dayDisp.hora_fin.split(':')[0]);

    for (let h = startHour; h < endHour; h++) {
      times.push(`${h.toString().padStart(2, '0')}:00`);
    }

    return times;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario || !profesional) return;

    setSubmitting(true);
    setError('');

    try {
      const { error: insertError } = await supabase.from('citas').insert({
        cliente_id: usuario.id,
        profesional_id: profesionalId,
        fecha: selectedDate,
        hora_inicio: selectedTime,
        hora_fin: `${parseInt(selectedTime.split(':')[0]) + 1}:00`,
        servicio,
        descripcion,
        estado: 'pendiente'
      });

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err) {
      console.error('Error creating cita:', err);
      setError('Error al crear la cita. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  if (!profesional) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cita solicitada!</h1>
          <p className="text-gray-600 mb-6">
            Tu solicitud fue enviada a <strong>{profesional.nombre}</strong>.
            Te avisaremos cuando confirme la cita.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">
              <Calendar className="w-4 h-4 inline mr-2" />
              {new Date(selectedDate).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <Clock className="w-4 h-4 inline mr-2" />
              {selectedTime} hs
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href="/dashboard/cliente"
              className="block w-full bg-primary-500 hover:bg-primary-600 text-secondary-900 font-bold py-3 rounded-xl"
            >
              Ver mis citas
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];
  const datesWithAvailability = availableDates.filter(d => {
    return disponibilidad.some(disp => disp.dia_semana === d.dayOfWeek);
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-secondary-900 text-white py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-secondary-800 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Agendar cita</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profesional info */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
              <User className="w-7 h-7 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-900">{profesional.nombre}</h2>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profesional.zona}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">{profesional.calificacion}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">{profesional.trabajos_completados} trabajos</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {disponibilidad.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-yellow-800 font-medium">Este profesional no tiene horarios configurados</p>
            <p className="text-yellow-600 text-sm mt-1">Podes contactarlo directamente por WhatsApp</p>
            <a
              href={`https://wa.me/${profesional.telefono}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Contactar por WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Servicio */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Que servicio necesitas?
              </label>
              <div className="flex flex-wrap gap-2">
                {profesional.servicios?.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setServicio(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
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
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                Selecciona un dia
              </label>
              {datesWithAvailability.length === 0 ? (
                <p className="text-gray-500 text-sm">No hay dias disponibles</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {datesWithAvailability.map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => { setSelectedDate(d.date); setSelectedTime(''); }}
                      className={`p-3 rounded-lg text-center transition-all ${
                        selectedDate === d.date
                          ? 'bg-primary-500 text-secondary-900'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <p className="text-xs font-medium">{d.label}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hora */}
            {selectedDate && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Selecciona un horario
                </label>
                {availableTimes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay horarios disponibles para este dia</p>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-primary-500 text-secondary-900'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Descripcion */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe brevemente el trabajo (opcional)
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Ej: Necesito cambiar un enchufe en la cocina..."
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!selectedDate || !selectedTime || !servicio || submitting}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-secondary-900 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando solicitud...
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  Solicitar cita
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              El profesional recibira tu solicitud y podra aceptarla o proponer otro horario
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
