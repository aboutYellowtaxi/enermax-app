'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Star, TrendingUp, User, Phone, MapPin, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase, Cita } from '@/lib/supabase';

interface LeadCliente {
  id: string;
  nombre: string;
  telefono: string;
  zona: string;
  servicio_requerido: string;
  descripcion: string;
  estado: string;
  created_at: string;
}

export default function DashboardProfesionalPage() {
  const { usuario } = useAuth();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [solicitudes, setSolicitudes] = useState<LeadCliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendientes: 0,
    aceptadas: 0,
    completadas: 0,
    rechazadas: 0,
  });

  useEffect(() => {
    if (usuario?.profesional_id) {
      fetchCitas();
      fetchSolicitudes();
    }
  }, [usuario]);

  const fetchCitas = async () => {
    if (!usuario?.profesional_id) return;

    const { data } = await supabase
      .from('citas')
      .select('*, cliente:usuarios(*)')
      .eq('profesional_id', usuario.profesional_id)
      .order('fecha', { ascending: true });

    if (data) {
      setCitas(data);
      setStats({
        pendientes: data.filter(c => c.estado === 'pendiente').length,
        aceptadas: data.filter(c => c.estado === 'aceptada').length,
        completadas: data.filter(c => c.estado === 'completada').length,
        rechazadas: data.filter(c => c.estado === 'rechazada').length,
      });
    }
    setLoading(false);
  };

  const fetchSolicitudes = async () => {
    // Buscar leads que mencionen al profesional
    const { data: profData } = await supabase
      .from('leads_profesionales')
      .select('nombre')
      .eq('id', usuario?.profesional_id)
      .single();

    if (profData?.nombre) {
      const { data } = await supabase
        .from('leads_clientes')
        .select('*')
        .ilike('descripcion', `%${profData.nombre}%`)
        .order('created_at', { ascending: false });

      if (data) {
        setSolicitudes(data);
      }
    }
  };

  const handleAcceptCita = async (citaId: string) => {
    await supabase
      .from('citas')
      .update({ estado: 'aceptada', updated_at: new Date().toISOString() })
      .eq('id', citaId);
    fetchCitas();
  };

  const handleRejectCita = async (citaId: string) => {
    await supabase
      .from('citas')
      .update({ estado: 'rechazada', updated_at: new Date().toISOString() })
      .eq('id', citaId);
    fetchCitas();
  };

  const handleCompleteCita = async (citaId: string) => {
    await supabase
      .from('citas')
      .update({ estado: 'completada', updated_at: new Date().toISOString() })
      .eq('id', citaId);
    fetchCitas();
  };

  const citasPendientes = citas.filter(c => c.estado === 'pendiente');
  const citasProximas = citas.filter(c => c.estado === 'aceptada' && new Date(c.fecha) >= new Date());

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Hola, {usuario?.nombre}!</h1>
        <p className="text-secondary-300">
          Gestioná tus citas y configurá tu disponibilidad desde acá.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pendientes}</p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.aceptadas}</p>
              <p className="text-sm text-gray-500">Programadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.completadas}</p>
              <p className="text-sm text-gray-500">Completadas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{solicitudes.length}</p>
              <p className="text-sm text-gray-500">Solicitudes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/profesional/agenda"
          className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border-2 border-transparent hover:border-primary-200"
        >
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-xl">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Configurar disponibilidad</h3>
              <p className="text-sm text-gray-500">Define tus horarios de trabajo</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Solicitudes de clientes (leads) */}
      {solicitudes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-green-50">
            <h2 className="font-semibold text-green-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Nuevas solicitudes ({solicitudes.length})
            </h2>
            <p className="text-sm text-green-600 mt-1">Clientes que quieren contactarte</p>
          </div>
          <div className="divide-y">
            {solicitudes.map((lead) => (
              <div key={lead.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900">{lead.nombre}</p>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a href={`tel:${lead.telefono}`} className="text-primary-600 hover:underline">
                          {lead.telefono}
                        </a>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {lead.zona}
                      </p>
                      <span className="inline-block mt-1 bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full capitalize">
                        {lead.servicio_requerido}
                      </span>
                    </div>
                    {lead.descripcion && (
                      <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                        {lead.descripcion}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(lead.created_at).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/54${lead.telefono.replace(/\D/g, '')}?text=Hola ${lead.nombre}! Soy de Enermax, vi tu solicitud de ${lead.servicio_requerido}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Citas pendientes */}
      {citasPendientes.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-yellow-50">
            <h2 className="font-semibold text-yellow-800 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Solicitudes pendientes ({citasPendientes.length})
            </h2>
          </div>
          <div className="divide-y">
            {citasPendientes.map((cita) => (
              <div key={cita.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{cita.cliente?.nombre || 'Cliente'}</p>
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
                    {cita.descripcion && (
                      <p className="text-sm text-gray-600 mt-2">{cita.descripcion}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRejectCita(cita.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
                      title="Rechazar"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleAcceptCita(cita.id)}
                      className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg"
                      title="Aceptar"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proximas citas */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Proximas citas
          </h2>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : citasProximas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No tenes citas programadas
          </div>
        ) : (
          <div className="divide-y">
            {citasProximas.map((cita) => (
              <div key={cita.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{cita.cliente?.nombre || 'Cliente'}</p>
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
                    onClick={() => handleCompleteCita(cita.id)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"
                  >
                    Marcar completada
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* No profile linked message */}
      {!usuario?.profesional_id && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-yellow-800 font-medium">Tu cuenta no esta vinculada a un perfil profesional</p>
          <p className="text-yellow-600 text-sm mt-1">Contactanos para activar tu perfil</p>
        </div>
      )}
    </div>
  );
}
