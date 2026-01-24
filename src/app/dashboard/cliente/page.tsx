'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock, CheckCircle, XCircle, Search, Star, AlertCircle,
  MapPin, Phone, MessageSquare, Calendar, User, Zap,
  ChevronRight, RefreshCw, Shield, ThumbsUp
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
  calificacion_cliente?: number;
}

type TabType = 'activas' | 'completadas' | 'todas';

// Extraer info del profesional desde la descripcion
const extraerInfoProfesional = (descripcion: string) => {
  const match = descripcion.match(/Solicitud con (.+?)\n/);
  return match ? match[1] : null;
};

const extraerPrecio = (descripcion: string) => {
  const match = descripcion.match(/\$([0-9,.]+)/);
  return match ? match[1] : null;
};

export default function DashboardClientePage() {
  const { usuario, user } = useAuth();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('activas');
  const [calificando, setCalificando] = useState<string | null>(null);

  useEffect(() => {
    if (usuario?.telefono || usuario?.nombre) {
      fetchSolicitudes();
    } else {
      setLoading(false);
    }
  }, [usuario]);

  const fetchSolicitudes = async () => {
    try {
      // Buscar por telefono o nombre del usuario
      let query = supabase
        .from('leads_clientes')
        .select('*')
        .order('created_at', { ascending: false });

      // Intentar buscar por telefono primero (mas preciso)
      if (usuario?.telefono) {
        query = query.eq('telefono', usuario.telefono);
      } else if (usuario?.nombre) {
        query = query.ilike('nombre', `%${usuario.nombre}%`);
      }

      const { data, error } = await query;

      if (data) {
        setSolicitudes(data);
      }
    } catch (err) {
      console.error('Error fetching solicitudes:', err);
    } finally {
      setLoading(false);
    }
  };

  // Confirmar servicio completado (libera pago en el futuro)
  const confirmarServicio = async (id: string, calificacion: number) => {
    const { error } = await supabase
      .from('leads_clientes')
      .update({
        estado: 'completado',
        calificacion_cliente: calificacion
      })
      .eq('id', id);

    if (!error) {
      setSolicitudes(prev =>
        prev.map(s => s.id === id ? { ...s, estado: 'completado', calificacion_cliente: calificacion } : s)
      );
      setCalificando(null);
    }
  };

  // Filtrar solicitudes
  const solicitudesFiltradas = solicitudes.filter(s => {
    switch (activeTab) {
      case 'activas':
        return ['pendiente', 'nuevo', 'cita_solicitada', 'contactado'].includes(s.estado);
      case 'completadas':
        return s.estado === 'completado';
      case 'todas':
        return true;
      default:
        return true;
    }
  });

  const contarActivas = () =>
    solicitudes.filter(s => ['pendiente', 'nuevo', 'cita_solicitada', 'contactado'].includes(s.estado)).length;

  const contarCompletadas = () =>
    solicitudes.filter(s => s.estado === 'completado').length;

  const getEstadoInfo = (estado: string) => {
    switch (estado) {
      case 'pendiente':
      case 'nuevo':
      case 'cita_solicitada':
        return {
          label: 'Esperando respuesta',
          color: 'bg-yellow-100 text-yellow-700',
          icon: Clock,
          description: 'El profesional revisara tu solicitud pronto'
        };
      case 'contactado':
        return {
          label: 'En proceso',
          color: 'bg-blue-100 text-blue-700',
          icon: MessageSquare,
          description: 'El profesional se puso en contacto'
        };
      case 'completado':
        return {
          label: 'Completado',
          color: 'bg-green-100 text-green-700',
          icon: CheckCircle,
          description: 'Servicio completado'
        };
      case 'rechazado':
      case 'archivado':
        return {
          label: 'Cancelado',
          color: 'bg-gray-100 text-gray-700',
          icon: XCircle,
          description: 'Solicitud cancelada'
        };
      default:
        return {
          label: estado,
          color: 'bg-gray-100 text-gray-700',
          icon: AlertCircle,
          description: ''
        };
    }
  };

  const tabs = [
    { id: 'activas' as TabType, label: 'Activas', count: contarActivas() },
    { id: 'completadas' as TabType, label: 'Completadas', count: contarCompletadas() },
    { id: 'todas' as TabType, label: 'Historial', count: solicitudes.length },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-400 rounded-2xl p-6 text-secondary-900">
        <h1 className="text-2xl font-bold mb-2">Hola, {usuario?.nombre || 'Usuario'}!</h1>
        <p className="opacity-80">
          Desde aca podes ver el estado de tus solicitudes y buscar profesionales.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{contarActivas()}</p>
              <p className="text-sm text-gray-500">Activas</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{contarCompletadas()}</p>
              <p className="text-sm text-gray-500">Completados</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Pago protegido</p>
              <p className="text-xs text-gray-500">Tus pagos estan seguros con Enermax</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buscar profesional */}
      <Link
        href="/conectar"
        className="block bg-secondary-900 hover:bg-secondary-800 rounded-xl p-6 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary-500 p-3 rounded-xl">
              <Zap className="w-6 h-6 text-secondary-900" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Necesitas otro servicio?</h3>
              <p className="text-secondary-400 text-sm">Encontra electricistas, plomeros y mas</p>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-secondary-500 group-hover:text-primary-400 transition-colors" />
        </div>
      </Link>

      {/* Tabs + Lista */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
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
          <div className="p-8 text-center text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-primary-500" />
            Cargando tus solicitudes...
          </div>
        ) : solicitudesFiltradas.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {activeTab === 'activas' ? 'No tenes solicitudes activas' :
               activeTab === 'completadas' ? 'Aun no completaste ningun servicio' :
               'No tenes solicitudes todavia'}
            </p>
            <Link
              href="/conectar"
              className="inline-block bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold px-6 py-2 rounded-full"
            >
              Buscar profesional
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {solicitudesFiltradas.map((solicitud) => {
              const estadoInfo = getEstadoInfo(solicitud.estado);
              const profesionalNombre = extraerInfoProfesional(solicitud.descripcion);
              const precio = extraerPrecio(solicitud.descripcion);
              const IconoEstado = estadoInfo.icon;

              return (
                <div key={solicitud.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Icon estado */}
                    <div className={`p-2 rounded-lg flex-shrink-0 ${estadoInfo.color}`}>
                      <IconoEstado className="w-5 h-5" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">
                            {solicitud.servicio_requerido}
                          </p>
                          {profesionalNombre && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {profesionalNombre}
                            </p>
                          )}
                        </div>
                        {precio && (
                          <p className="font-bold text-primary-600 whitespace-nowrap">
                            ${precio}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {solicitud.zona}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(solicitud.created_at).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      </div>

                      {/* Badge de estado */}
                      <div className="mt-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estadoInfo.color}`}>
                          {estadoInfo.label}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {estadoInfo.description}
                        </span>
                      </div>

                      {/* Acciones segun estado */}
                      {solicitud.estado === 'contactado' && calificando !== solicitud.id && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => setCalificando(solicitud.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            Confirmar servicio completado
                          </button>
                        </div>
                      )}

                      {/* Panel de calificacion */}
                      {calificando === solicitud.id && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                          <p className="text-sm font-medium text-yellow-800 mb-2">
                            Como fue el servicio?
                          </p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => confirmarServicio(solicitud.id, star)}
                                className="p-2 hover:bg-yellow-100 rounded-lg transition-colors group"
                              >
                                <Star className="w-6 h-6 text-yellow-400 group-hover:fill-current" />
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setCalificando(null)}
                            className="text-xs text-gray-500 mt-2 hover:text-gray-700"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}

                      {/* Mostrar calificacion si ya califico */}
                      {solicitud.calificacion_cliente && (
                        <div className="mt-2 flex items-center gap-1">
                          <span className="text-xs text-gray-500">Tu calificacion:</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= solicitud.calificacion_cliente!
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tip */}
      {solicitudes.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Cuando el profesional complete el trabajo, confirma el servicio para que reciba su pago.
            Tu opinion ayuda a otros usuarios a encontrar buenos profesionales.
          </p>
        </div>
      )}
    </div>
  );
}
