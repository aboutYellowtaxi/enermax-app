'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle, XCircle, Search, Star, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase, Cita, Profesional } from '@/lib/supabase';

export default function DashboardClientePage() {
  const { usuario } = useAuth();
  const [citas, setCitas] = useState<(Cita & { profesional?: Profesional })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (usuario?.id) {
      fetchCitas();
    }
  }, [usuario]);

  const fetchCitas = async () => {
    if (!usuario?.id) return;

    const { data } = await supabase
      .from('citas')
      .select('*, profesional:leads_profesionales(*)')
      .eq('cliente_id', usuario.id)
      .order('fecha', { ascending: false });

    if (data) {
      setCitas(data);
    }
    setLoading(false);
  };

  const handleCancelCita = async (citaId: string) => {
    if (!confirm('Seguro que queres cancelar esta cita?')) return;

    await supabase
      .from('citas')
      .update({ estado: 'cancelada', updated_at: new Date().toISOString() })
      .eq('id', citaId);
    fetchCitas();
  };

  const citasPendientes = citas.filter(c => c.estado === 'pendiente');
  const citasConfirmadas = citas.filter(c => c.estado === 'aceptada');
  const citasCompletadas = citas.filter(c => c.estado === 'completada');

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">Pendiente</span>;
      case 'aceptada':
        return <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Confirmada</span>;
      case 'completada':
        return <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Completada</span>;
      case 'rechazada':
        return <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">Rechazada</span>;
      case 'cancelada':
        return <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">Cancelada</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Hola, {usuario?.nombre}!</h1>
        <p className="text-secondary-300">
          Desde aca podes ver tus citas y buscar profesionales.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{citasPendientes.length}</p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{citasConfirmadas.length}</p>
              <p className="text-sm text-gray-500">Confirmadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{citasCompletadas.length}</p>
              <p className="text-sm text-gray-500">Completadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buscar profesional */}
      <Link
        href="/profesionales"
        className="block bg-primary-500 hover:bg-primary-600 rounded-xl p-6 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Search className="w-6 h-6 text-secondary-900" />
          </div>
          <div>
            <h3 className="font-bold text-secondary-900 text-lg">Buscar profesional</h3>
            <p className="text-secondary-800 text-sm">Encontra electricistas, plomeros y mas</p>
          </div>
        </div>
      </Link>

      {/* Citas pendientes de confirmacion */}
      {citasPendientes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-yellow-50">
            <h2 className="font-semibold text-yellow-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Esperando confirmacion ({citasPendientes.length})
            </h2>
          </div>
          <div className="divide-y">
            {citasPendientes.map((cita) => (
              <div key={cita.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{cita.profesional?.nombre || 'Profesional'}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(cita.fecha).toLocaleDateString('es-AR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })} - {cita.hora_inicio}
                    </p>
                    {cita.servicio && (
                      <span className="inline-block mt-1 bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                        {cita.servicio}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCancelCita(cita.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Todas las citas */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Historial de citas
          </h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : citas.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No tenes citas todavia</p>
            <Link
              href="/profesionales"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold px-6 py-2 rounded-full"
            >
              Buscar profesional
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {citas.map((cita) => (
              <div key={cita.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{cita.profesional?.nombre || 'Profesional'}</p>
                      {getEstadoBadge(cita.estado)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(cita.fecha).toLocaleDateString('es-AR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long'
                      })} - {cita.hora_inicio}
                    </p>
                    {cita.servicio && (
                      <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {cita.servicio}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {cita.profesional?.calificacion && (
                      <>
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{cita.profesional.calificacion}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
