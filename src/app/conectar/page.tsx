'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Loader2, Zap, Search, Navigation, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Zonas principales para seleccion rapida
const ZONAS_RAPIDAS = [
  'Moreno', 'Merlo', 'Ituzaingo', 'Moron', 'Capital Federal',
  'Quilmes', 'La Plata', 'San Isidro', 'Tigre', 'Pilar'
];

interface Profesional {
  id: string;
  nombre: string;
  zona: string;
  zonas_cobertura: string[];
  servicios: string[];
  calificacion: number;
}

export default function ConectarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [zonaSeleccionada, setZonaSeleccionada] = useState('');
  const [profesionalEncontrado, setProfesionalEncontrado] = useState<Profesional | null>(null);
  const [geoError, setGeoError] = useState('');

  // Buscar profesional mas cercano por zona
  const buscarProfesional = async (zona: string) => {
    setBuscando(true);
    setZonaSeleccionada(zona);

    try {
      // Buscar profesional que cubra esta zona
      const { data, error } = await supabase
        .from('leads_profesionales')
        .select('*')
        .eq('disponible', true)
        .contains('zonas_cobertura', [zona]);

      if (data && data.length > 0) {
        // Ordenar por calificacion y tomar el mejor
        const mejor = data.sort((a, b) => b.calificacion - a.calificacion)[0];
        setProfesionalEncontrado(mejor);
      } else {
        // Si no hay en esa zona, buscar cualquier disponible
        const { data: todos } = await supabase
          .from('leads_profesionales')
          .select('*')
          .eq('disponible', true)
          .limit(1);

        if (todos && todos.length > 0) {
          setProfesionalEncontrado(todos[0]);
        }
      }
    } catch (err) {
      console.error('Error buscando profesional:', err);
    } finally {
      setBuscando(false);
    }
  };

  // Intentar obtener ubicacion del usuario
  const obtenerUbicacion = () => {
    setLoading(true);
    setGeoError('');

    if (!navigator.geolocation) {
      setGeoError('Tu navegador no soporta geolocalizacion');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // Por ahora, simplemente asumimos zona cercana y buscamos
        // En el futuro se puede usar reverse geocoding
        buscarProfesional('Moreno'); // Default a Moreno donde esta Leonel
        setLoading(false);
      },
      (error) => {
        setGeoError('No pudimos obtener tu ubicacion. Selecciona tu zona manualmente.');
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  // Ir a agendar con el profesional encontrado
  const irAgendar = () => {
    if (profesionalEncontrado) {
      router.push(`/agendar/${profesionalEncontrado.id}?zona=${encodeURIComponent(zonaSeleccionada)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-900 to-secondary-800">
      {/* Header */}
      <div className="bg-secondary-900 py-4 border-b border-secondary-700">
        <div className="max-w-lg mx-auto px-4 flex items-center gap-3">
          <Zap className="w-6 h-6 text-primary-500" />
          <span className="text-xl font-bold text-white">Enermax</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Paso 1: Elegir zona */}
        {!profesionalEncontrado && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Donde necesitas el servicio?
              </h1>
              <p className="text-secondary-400">
                Te conectamos con el profesional mas cercano
              </p>
            </div>

            {/* Boton geolocalizacion */}
            <button
              onClick={obtenerUbicacion}
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Obteniendo ubicacion...
                </>
              ) : (
                <>
                  <Navigation className="w-5 h-5" />
                  Usar mi ubicacion actual
                </>
              )}
            </button>

            {geoError && (
              <p className="text-center text-yellow-400 text-sm">{geoError}</p>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-secondary-800 text-secondary-400">o selecciona tu zona</span>
              </div>
            </div>

            {/* Zonas rapidas */}
            <div className="grid grid-cols-2 gap-2">
              {ZONAS_RAPIDAS.map((zona) => (
                <button
                  key={zona}
                  onClick={() => buscarProfesional(zona)}
                  disabled={buscando}
                  className="bg-secondary-700 hover:bg-secondary-600 text-white py-3 px-4 rounded-xl text-center transition-all disabled:opacity-50"
                >
                  {buscando && zonaSeleccionada === zona ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    zona
                  )}
                </button>
              ))}
            </div>

            {/* Input manual */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-500" />
              <input
                type="text"
                placeholder="O escribe otra localidad..."
                className="w-full bg-secondary-700 border border-secondary-600 text-white pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    buscarProfesional(e.currentTarget.value);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Paso 2: Profesional encontrado */}
        {profesionalEncontrado && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Encontramos un profesional!
              </h1>
              <p className="text-secondary-400">
                Disponible en tu zona
              </p>
            </div>

            {/* Card profesional */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-8 h-8 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{profesionalEncontrado.nombre}</h2>
                  <p className="text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profesionalEncontrado.zona}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < profesionalEncontrado.calificacion ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      ({profesionalEncontrado.calificacion})
                    </span>
                  </div>
                </div>
              </div>

              {/* Servicios */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Servicios disponibles:</p>
                <div className="flex flex-wrap gap-2">
                  {profesionalEncontrado.servicios?.map((s) => (
                    <span
                      key={s}
                      className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm capitalize"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Zona seleccionada */}
              <div className="mt-4 bg-green-50 rounded-xl p-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="text-green-800">
                  Cubre <strong>{zonaSeleccionada}</strong> y alrededores
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={irAgendar}
              className="w-full bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg"
            >
              Ver servicios y precios
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Cambiar zona */}
            <button
              onClick={() => setProfesionalEncontrado(null)}
              className="w-full text-secondary-400 hover:text-white py-2 text-sm transition-colors"
            >
              Buscar en otra zona
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
