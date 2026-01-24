'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar, Clock, CheckCircle, XCircle, AlertCircle,
  User, Phone, MapPin, MessageSquare, RotateCcw,
  Trash2, PhoneCall, Archive
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface Solicitud {
  id: string;
  nombre: string;
  telefono: string;
  zona: string;
  servicio_requerido: string;
  descripcion: string;
  estado: string;
  created_at: string;
}

type TabType = 'pendientes' | 'contactados' | 'completados' | 'archivados';

export default function DashboardProfesionalPage() {
  const { usuario } = useAuth();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('pendientes');
  const [profesionalNombre, setProfesionalNombre] = useState('');

  useEffect(() => {
    if (usuario?.profesional_id) {
      fetchProfesionalNombre();
      fetchSolicitudes();
    }
  }, [usuario]);

  const fetchProfesionalNombre = async () => {
    const { data } = await supabase
      .from('leads_profesionales')
      .select('nombre')
      .eq('id', usuario?.profesional_id)
      .single();

    if (data) {
      setProfesionalNombre(data.nombre);
    }
  };

  const fetchSolicitudes = async () => {
    if (!profesionalNombre && !usuario?.profesional_id) return;

    // Primero obtener el nombre si no lo tenemos
    let nombre = profesionalNombre;
    if (!nombre) {
      const { data: profData } = await supabase
        .from('leads_profesionales')
        .select('nombre')
        .eq('id', usuario?.profesional_id)
        .single();
      nombre = profData?.nombre || '';
    }

    if (nombre) {
      const { data } = await supabase
        .from('leads_clientes')
        .select('*')
        .ilike('descripcion', `%${nombre}%`)
        .order('created_at', { ascending: false });

      if (data) {
        setSolicitudes(data);
      }
    }
    setLoading(false);
  };

  // Cambiar estado de una solicitud
  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase
      .from('leads_clientes')
      .update({ estado: nuevoEstado })
      .eq('id', id);

    if (!error) {
      setSolicitudes(prev =>
        prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s)
      );
    }
  };

  // Filtrar solicitudes por tab
  const solicitudesFiltradas = solicitudes.filter(s => {
    switch (activeTab) {
      case 'pendientes':
        return s.estado === 'pendiente' || s.estado === 'nuevo' || s.estado === 'cita_solicitada';
      case 'contactados':
        return s.estado === 'contactado';
      case 'completados':
        return s.estado === 'completado';
      case 'archivados':
        return s.estado === 'rechazado' || s.estado === 'archivado';
      default:
        return true;
    }
  });

  // Contar por estado
  const contarPorEstado = (estados: string[]) =>
    solicitudes.filter(s => estados.includes(s.estado)).length;

  const tabs = [
    { id: 'pendientes' as TabType, label: 'Pendientes', count: contarPorEstado(['pendiente', 'nuevo', 'cita_solicitada']), color: 'yellow' },
    { id: 'contactados' as TabType, label: 'Contactados', count: contarPorEstado(['contactado']), color: 'blue' },
    { id: 'completados' as TabType, label: 'Completados', count: contarPorEstado(['completado']), color: 'green' },
    { id: 'archivados' as TabType, label: 'Archivados', count: contarPorEstado(['rechazado', 'archivado']), color: 'gray' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Hola, {usuario?.nombre || profesionalNombre}!</h1>
        <p className="text-secondary-300">
          Gestiona tus solicitudes de clientes desde aca.
        </p>
      </div>

      {/* Stats rapidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{contarPorEstado(['pendiente', 'nuevo', 'cita_solicitada'])}</p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <PhoneCall className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{contarPorEstado(['contactado'])}</p>
              <p className="text-sm text-gray-500">Contactados</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{contarPorEstado(['completado'])}</p>
              <p className="text-sm text-gray-500">Completados</p>
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
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[120px] px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-500 text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Lista de solicitudes */}
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : solicitudesFiltradas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Archive className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay solicitudes en esta seccion</p>
          </div>
        ) : (
          <div className="divide-y">
            {solicitudesFiltradas.map((solicitud) => (
              <div key={solicitud.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Info del cliente */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <p className="font-medium text-gray-900 truncate">{solicitud.nombre}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-600">
                      <a
                        href={`tel:${solicitud.telefono}`}
                        className="flex items-center gap-2 text-primary-600 hover:underline"
                      >
                        <Phone className="w-4 h-4 text-gray-400" />
                        {solicitud.telefono}
                      </a>
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {solicitud.zona}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                        {solicitud.servicio_requerido}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(solicitud.created_at).toLocaleDateString('es-AR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {solicitud.descripcion && (
                      <p className="text-sm text-gray-500 mt-2 bg-gray-50 p-2 rounded line-clamp-2">
                        {solicitud.descripcion}
                      </p>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {/* WhatsApp siempre visible */}
                    <a
                      href={`https://wa.me/54${solicitud.telefono.replace(/\D/g, '')}?text=Hola ${solicitud.nombre}! Soy ${profesionalNombre || usuario?.nombre} de Enermax, vi tu solicitud de ${solicitud.servicio_requerido}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    {/* Acciones segun estado */}
                    {activeTab === 'pendientes' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => cambiarEstado(solicitud.id, 'contactado')}
                          className="flex-1 p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg"
                          title="Marcar como contactado"
                        >
                          <PhoneCall className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          onClick={() => cambiarEstado(solicitud.id, 'archivado')}
                          className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
                          title="Archivar"
                        >
                          <Archive className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    )}

                    {activeTab === 'contactados' && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => cambiarEstado(solicitud.id, 'completado')}
                          className="flex-1 p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg"
                          title="Marcar como completado"
                        >
                          <CheckCircle className="w-4 h-4 mx-auto" />
                        </button>
                        <button
                          onClick={() => cambiarEstado(solicitud.id, 'archivado')}
                          className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg"
                          title="Archivar"
                        >
                          <Archive className="w-4 h-4 mx-auto" />
                        </button>
                      </div>
                    )}

                    {activeTab === 'archivados' && (
                      <button
                        onClick={() => cambiarEstado(solicitud.id, 'pendiente')}
                        className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-lg flex items-center gap-1 justify-center"
                        title="Restaurar a pendientes"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-xs">Restaurar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
