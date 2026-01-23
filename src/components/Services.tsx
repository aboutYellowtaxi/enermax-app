'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  MapPin,
  ArrowRight,
  Zap,
  Droplets,
  Wrench,
  Briefcase,
  Users,
  Flame,
  PaintBucket,
  Hammer,
  Wind
} from 'lucide-react';

const SUPABASE_URL = 'https://ptgkjfofknpueepscdrq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Z2tqZm9ma25wdWVlcHNjZHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMjU0MDAsImV4cCI6MjA4NDcwMTQwMH0.QrSmVihF3Srx3IOEzD9BCuFqdLFGXe2K9ulJ6NL5g2s';

interface Profesional {
  id: string;
  nombre: string;
  zona: string;
  servicios: string[];
  calificacion: number;
  trabajos_completados: number;
}

const getServicioIcon = (servicio: string) => {
  const s = servicio.toLowerCase();
  if (s.includes('electric')) return Zap;
  if (s.includes('plom')) return Droplets;
  if (s.includes('contrat') || s.includes('construc')) return Wrench;
  if (s.includes('gas')) return Flame;
  if (s.includes('pintu')) return PaintBucket;
  if (s.includes('carpint') || s.includes('mueble')) return Hammer;
  if (s.includes('aire') || s.includes('clima') || s.includes('refrig')) return Wind;
  return Briefcase;
};

export default function Services() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfesionales();
  }, []);

  const fetchProfesionales = async () => {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/leads_profesionales?disponible=eq.true&select=id,nombre,zona,servicios,calificacion,trabajos_completados&order=trabajos_completados.desc&limit=6`,
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

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
            Nuestros Profesionales
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-4">
            Expertos cerca tuyo
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Profesionales verificados en electricidad, plomeria, gas, pintura y mas.
            Todos con calificaciones reales de clientes.
          </p>
        </div>

        {/* Categorias */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link
            href="/profesionales?oficio=electricidad"
            className="flex items-center gap-2 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-full font-medium transition-all text-sm"
          >
            <Zap className="w-4 h-4" />
            Electricistas
          </Link>
          <Link
            href="/profesionales?oficio=plomeria"
            className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-4 py-2 rounded-full font-medium transition-all text-sm"
          >
            <Droplets className="w-4 h-4" />
            Plomeros
          </Link>
          <Link
            href="/profesionales?oficio=gasista"
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-full font-medium transition-all text-sm"
          >
            <Flame className="w-4 h-4" />
            Gasistas
          </Link>
          <Link
            href="/profesionales?oficio=pintura"
            className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 px-4 py-2 rounded-full font-medium transition-all text-sm"
          >
            <PaintBucket className="w-4 h-4" />
            Pintores
          </Link>
          <Link
            href="/profesionales?oficio=contratista"
            className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 px-4 py-2 rounded-full font-medium transition-all text-sm"
          >
            <Wrench className="w-4 h-4" />
            Contratistas
          </Link>
          <Link
            href="/profesionales?oficio=aire"
            className="flex items-center gap-2 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-700 px-4 py-2 rounded-full font-medium transition-all text-sm"
          >
            <Wind className="w-4 h-4" />
            Aire Acondicionado
          </Link>
        </div>

        {/* Grid de profesionales */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : profesionales.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Pronto tendras profesionales disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profesionales.map((prof) => {
              const IconComponent = getServicioIcon(prof.servicios?.[0] || '');
              return (
                <Link
                  key={prof.id}
                  href="/profesionales"
                  className="group bg-gray-50 hover:bg-secondary-900 rounded-xl p-6 transition-all duration-300 border border-gray-100 hover:border-secondary-800"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-primary-500/10 group-hover:bg-primary-500/20 w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                      <IconComponent className="w-6 h-6 text-primary-500" />
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-secondary-900 group-hover:text-white transition-colors">
                        {prof.calificacion}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-white mb-1 transition-colors">
                    {prof.nombre}
                  </h3>

                  <p className="text-secondary-500 group-hover:text-secondary-400 text-sm flex items-center gap-1 mb-3 transition-colors">
                    <MapPin className="w-3 h-3" />
                    {prof.zona}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {prof.servicios?.slice(0, 2).map((s, i) => (
                      <span
                        key={i}
                        className="bg-primary-500/10 group-hover:bg-primary-500/20 text-primary-600 group-hover:text-primary-400 text-xs px-2 py-0.5 rounded-full capitalize transition-colors"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-secondary-500 group-hover:text-secondary-400 text-sm transition-colors">
                    {prof.trabajos_completados} trabajos completados
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/profesionales"
            className="inline-flex items-center gap-2 bg-secondary-900 hover:bg-secondary-800 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-xl"
          >
            Ver todos los profesionales
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
