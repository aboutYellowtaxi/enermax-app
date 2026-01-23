'use client';

// Pagina de profesionales con filtros
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Star,
  MessageCircle,
  Briefcase,
  ArrowLeft,
  Filter,
  X,
  CheckCircle,
  Shield,
  Zap,
  Wrench,
  Droplets,
  Flame,
  PaintBucket,
  Wind
} from 'lucide-react';

const SUPABASE_URL = 'https://ptgkjfofknpueepscdrq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Z2tqZm9ma25wdWVlcHNjZHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMjU0MDAsImV4cCI6MjA4NDcwMTQwMH0.QrSmVihF3Srx3IOEzD9BCuFqdLFGXe2K9ulJ6NL5g2s';

interface Profesional {
  id: string;
  nombre: string;
  telefono: string;
  zona: string;
  zonas_cobertura: string[];
  servicios: string[];
  calificacion: number;
  trabajos_completados: number;
  bio: string;
  disponible: boolean;
}

const ZONAS = [
  'Todas',
  // GBA y CABA
  'Capital Federal', 'La Plata', 'Quilmes', 'Lanus', 'Avellaneda', 'Lomas de Zamora',
  'Moreno', 'Merlo', 'Moron', 'Ituzaingo', 'La Matanza', 'San Isidro', 'Tigre', 'Pilar',
  // Interior
  'Cordoba', 'Rosario', 'Mendoza', 'Tucuman', 'Mar del Plata', 'Salta', 'Santa Fe'
];

const OFICIOS = [
  { id: 'todos', label: 'Todos', icon: Briefcase },
  { id: 'electricidad', label: 'Electricista', icon: Zap },
  { id: 'plomeria', label: 'Plomero', icon: Droplets },
  { id: 'gasista', label: 'Gasista', icon: Flame },
  { id: 'pintura', label: 'Pintor', icon: PaintBucket },
  { id: 'contratista', label: 'Contratista', icon: Wrench },
  { id: 'aire', label: 'Aire Acond.', icon: Wind },
];

function ProfesionalesContent() {
  const searchParams = useSearchParams();
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [filteredProfs, setFilteredProfs] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filtros - inicializar desde URL params
  const [zonaFilter, setZonaFilter] = useState(searchParams.get('zona') || 'Todas');
  const [oficioFilter, setOficioFilter] = useState(searchParams.get('oficio') || 'todos');
  const [ordenar, setOrdenar] = useState<'rating' | 'trabajos'>('rating');

  // Lead form
  const [selectedProf, setSelectedProf] = useState<Profesional | null>(null);
  const [leadForm, setLeadForm] = useState({ nombre: '', telefono: '' });
  const [leadSent, setLeadSent] = useState(false);

  useEffect(() => {
    fetchProfesionales();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [profesionales, zonaFilter, oficioFilter, ordenar]);

  const fetchProfesionales = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/leads_profesionales?disponible=eq.true&select=*`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProfesionales(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtered = [...profesionales];

    // Filtrar por zona
    if (zonaFilter !== 'Todas') {
      filtered = filtered.filter(p =>
        p.zona.toLowerCase() === zonaFilter.toLowerCase() ||
        p.zonas_cobertura?.some(z => z.toLowerCase() === zonaFilter.toLowerCase())
      );
    }

    // Filtrar por oficio
    if (oficioFilter !== 'todos') {
      filtered = filtered.filter(p =>
        p.servicios?.some(s => s.toLowerCase().includes(oficioFilter.toLowerCase()))
      );
    }

    // Ordenar
    if (ordenar === 'rating') {
      filtered.sort((a, b) => b.calificacion - a.calificacion);
    } else {
      filtered.sort((a, b) => b.trabajos_completados - a.trabajos_completados);
    }

    setFilteredProfs(filtered);
  };

  const handleContactar = (prof: Profesional) => {
    setSelectedProf(prof);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProf) return;

    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads_clientes`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          nombre: leadForm.nombre,
          telefono: leadForm.telefono,
          zona: selectedProf.zona,
          servicio_requerido: selectedProf.servicios?.[0] || 'general',
          descripcion: `Contacto desde /profesionales con ${selectedProf.nombre}`,
          estado: 'nuevo'
        })
      });
    } catch (error) {
      console.error('Error guardando lead:', error);
    }

    setLeadSent(true);

    setTimeout(() => {
      const text = encodeURIComponent(
        `Hola ${selectedProf.nombre}! Soy ${leadForm.nombre}, vi tu perfil en Enermax.\n\nMe interesa tu servicio. Mi numero es ${leadForm.telefono}. ¿Podemos coordinar?`
      );
      window.open(`https://wa.me/${selectedProf.telefono}?text=${text}`, '_blank');
    }, 1500);
  };

  const closeModal = () => {
    setSelectedProf(null);
    setLeadSent(false);
    setLeadForm({ nombre: '', telefono: '' });
  };

  // Modal de contacto
  if (selectedProf) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          {leadSent ? (
            <div className="p-8 text-center relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Listo!</h2>
              <p className="text-gray-600 mb-6">
                Te estamos conectando con {selectedProf.nombre} por WhatsApp.
              </p>
              <button
                onClick={closeModal}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl"
              >
                Volver a profesionales
              </button>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={closeModal} className="p-1 hover:bg-secondary-700 rounded-full">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-bold">Contactar a {selectedProf.nombre}</h2>
                  </div>
                  <button onClick={closeModal} className="p-1 hover:bg-secondary-700 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-green-50 px-4 py-3 flex items-center justify-center gap-4 border-b border-green-100">
                <span className="flex items-center gap-1 text-sm text-green-700">
                  <Shield className="w-4 h-4" />
                  Tus datos estan seguros
                </span>
              </div>

              <form onSubmit={handleLeadSubmit} className="p-6 space-y-4">
                <p className="text-gray-600 text-sm mb-4">
                  Dejanos tus datos para que {selectedProf.nombre} pueda contactarte:
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tu nombre *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.nombre}
                    onChange={(e) => setLeadForm({ ...leadForm, nombre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Como te llamas?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tu numero *</label>
                  <input
                    type="tel"
                    required
                    value={leadForm.telefono}
                    onChange={(e) => setLeadForm({ ...leadForm, telefono: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="11-1234-5678"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contactar por WhatsApp
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-secondary-900 text-white py-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-secondary-800 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold">Profesionales</h1>
                <p className="text-secondary-400 text-sm">{filteredProfs.length} disponibles</p>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-secondary-800 hover:bg-secondary-700 px-4 py-2 rounded-lg"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
            {/* Zona */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zona</label>
              <div className="flex flex-wrap gap-2">
                {ZONAS.map((zona) => (
                  <button
                    key={zona}
                    onClick={() => setZonaFilter(zona)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      zonaFilter === zona
                        ? 'bg-primary-500 text-secondary-900'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {zona}
                  </button>
                ))}
              </div>
            </div>

            {/* Oficio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Oficio</label>
              <div className="flex flex-wrap gap-2">
                {OFICIOS.map((oficio) => (
                  <button
                    key={oficio.id}
                    onClick={() => setOficioFilter(oficio.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      oficioFilter === oficio.id
                        ? 'bg-primary-500 text-secondary-900'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <oficio.icon className="w-4 h-4" />
                    {oficio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ordenar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setOrdenar('rating')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    ordenar === 'rating'
                      ? 'bg-secondary-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Mejor calificacion
                </button>
                <button
                  onClick={() => setOrdenar('trabajos')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    ordenar === 'trabajos'
                      ? 'bg-secondary-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Mas trabajos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de profesionales */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando profesionales...</p>
          </div>
        ) : filteredProfs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay profesionales</h3>
            <p className="text-gray-500 mb-4">No encontramos profesionales con esos filtros.</p>
            <button
              onClick={() => { setZonaFilter('Todas'); setOficioFilter('todos'); }}
              className="bg-primary-500 text-secondary-900 font-semibold px-6 py-2 rounded-full"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProfs.map((prof) => (
              <div key={prof.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{prof.nombre}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {prof.zona}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{prof.calificacion}</span>
                    </div>
                    <p className="text-xs text-gray-500">{prof.trabajos_completados} trabajos</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {prof.servicios?.map((s, i) => (
                    <span key={i} className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full capitalize">
                      {s}
                    </span>
                  ))}
                </div>

                {prof.bio && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{prof.bio}</p>
                )}

                <p className="text-xs text-gray-400 mb-4">
                  Cubre: {prof.zonas_cobertura?.slice(0, 3).join(', ')}{prof.zonas_cobertura?.length > 3 ? '...' : ''}
                </p>

                <button
                  onClick={() => handleContactar(prof)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contactar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA flotante */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Link
          href="/"
          className="bg-secondary-900 hover:bg-secondary-800 text-white font-semibold px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Nueva busqueda
        </Link>
      </div>
    </div>
  );
}

export default function ProfesionalesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    }>
      <ProfesionalesContent />
    </Suspense>
  );
}
