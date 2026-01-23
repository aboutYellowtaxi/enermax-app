'use client';

import { useState, useEffect } from 'react';
import { Users, Briefcase, RefreshCw, ExternalLink, Phone, MapPin, Calendar } from 'lucide-react';

const SUPABASE_URL = 'https://ptgkjfofknpueepscdrq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Z2tqZm9ma25wdWVlcHNjZHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMjU0MDAsImV4cCI6MjA4NDcwMTQwMH0.QrSmVihF3Srx3IOEzD9BCuFqdLFGXe2K9ulJ6NL5g2s';

interface LeadCliente {
  id: string;
  nombre: string;
  telefono: string;
  zona: string;
  servicio_requerido: string;
  descripcion?: string;
  estado: string;
  created_at: string;
}

interface LeadProfesional {
  id: string;
  nombre: string;
  telefono: string;
  zona: string;
  zonas_cobertura: string[];
  servicios: string[];
  disponible: boolean;
  calificacion: number;
  trabajos_completados: number;
  bio?: string;
  created_at: string;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'clientes' | 'profesionales'>('clientes');
  const [clientes, setClientes] = useState<LeadCliente[]>([]);
  const [profesionales, setProfesionales] = useState<LeadProfesional[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch clientes
      const clientesRes = await fetch(`${SUPABASE_URL}/rest/v1/leads_clientes?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (clientesRes.ok) {
        const data = await clientesRes.json();
        setClientes(data);
      }

      // Fetch profesionales
      const profRes = await fetch(`${SUPABASE_URL}/rest/v1/leads_profesionales?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (profRes.ok) {
        const data = await profRes.json();
        setProfesionales(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openWhatsApp = (telefono: string, nombre: string) => {
    const text = encodeURIComponent(`Hola ${nombre}! Soy de Enermax.`);
    window.open(`https://wa.me/${telefono.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-secondary-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold">Enermax Admin</h1>
          <p className="text-secondary-400 text-sm">Panel de leads</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
                <p className="text-sm text-gray-500">Clientes</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{profesionales.length}</p>
                <p className="text-sm text-gray-500">Profesionales</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{clientes.filter(c => c.estado === 'nuevo').length}</p>
                <p className="text-sm text-gray-500">Nuevos</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{profesionales.filter(p => p.disponible).length}</p>
                <p className="text-sm text-gray-500">Disponibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('clientes')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'clientes'
                ? 'bg-secondary-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Clientes ({clientes.length})
          </button>
          <button
            onClick={() => setActiveTab('profesionales')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'profesionales'
                ? 'bg-secondary-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Briefcase className="w-4 h-4 inline mr-2" />
            Profesionales ({profesionales.length})
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="ml-auto px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-50 transition-all"
          >
            <RefreshCw className={`w-4 h-4 inline mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Cargando...</p>
          </div>
        ) : activeTab === 'clientes' ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {clientes.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay clientes registrados todavia
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-600">Nombre</th>
                      <th className="text-left p-4 font-medium text-gray-600">Telefono</th>
                      <th className="text-left p-4 font-medium text-gray-600">Zona</th>
                      <th className="text-left p-4 font-medium text-gray-600">Servicio</th>
                      <th className="text-left p-4 font-medium text-gray-600">Estado</th>
                      <th className="text-left p-4 font-medium text-gray-600">Fecha</th>
                      <th className="text-left p-4 font-medium text-gray-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {clientes.map((cliente) => (
                      <tr key={cliente.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-900">{cliente.nombre}</td>
                        <td className="p-4 text-gray-600">{cliente.telefono}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-gray-600">
                            <MapPin className="w-3 h-3" />
                            {cliente.zona}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{cliente.servicio_requerido}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            cliente.estado === 'nuevo' ? 'bg-green-100 text-green-700' :
                            cliente.estado === 'contactado' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {cliente.estado}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500 text-sm">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDate(cliente.created_at)}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => openWhatsApp(cliente.telefono, cliente.nombre)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            WhatsApp
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {profesionales.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay profesionales registrados todavia
              </div>
            ) : (
              <div className="grid gap-4 p-4">
                {profesionales.map((prof) => (
                  <div key={prof.id} className="border rounded-xl p-4 hover:border-primary-300 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{prof.nombre}</h3>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {prof.zona} - Cubre: {prof.zonas_cobertura?.join(', ') || 'No especificado'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prof.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {prof.disponible ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {prof.servicios?.map((servicio, i) => (
                        <span key={i} className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                          {servicio}
                        </span>
                      ))}
                    </div>

                    {prof.bio && (
                      <p className="mt-3 text-gray-600 text-sm">{prof.bio}</p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="mr-4">⭐ {prof.calificacion}</span>
                        <span>{prof.trabajos_completados} trabajos</span>
                      </div>
                      <button
                        onClick={() => openWhatsApp(prof.telefono, prof.nombre)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {prof.telefono}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Supabase link */}
        <div className="mt-6 text-center">
          <a
            href="https://supabase.com/dashboard/project/ptgkjfofknpueepscdrq/editor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-primary-500 inline-flex items-center gap-1"
          >
            Abrir en Supabase <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
