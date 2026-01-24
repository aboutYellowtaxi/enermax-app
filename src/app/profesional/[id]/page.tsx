'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Star, Phone, MessageSquare, Shield,
  CheckCircle, Clock, Zap, Calendar, User, Award, Briefcase,
  Camera, ChevronRight, Loader2, AlertCircle
} from 'lucide-react';
import { supabase, Profesional } from '@/lib/supabase';

// Servicios con precios (mismo que en agendar)
const SERVICIOS_ELECTRICIDAD = [
  { id: 'visita', nombre: 'Visita + Diagnostico', precio: 15000, descripcion: 'Visita a domicilio, revision del problema y presupuesto' },
  { id: 'tomacorriente', nombre: 'Cambio de tomacorriente', precio: 8000, descripcion: 'Reemplazo de tomacorriente (materiales aparte)' },
  { id: 'luminaria', nombre: 'Instalacion luminaria', precio: 12000, descripcion: 'Instalacion de lampara o spot (materiales aparte)' },
  { id: 'termica', nombre: 'Cambio termica/disyuntor', precio: 18000, descripcion: 'Reemplazo en tablero (materiales aparte)' },
  { id: 'tablero', nombre: 'Revision tablero completa', precio: 25000, descripcion: 'Revision completa, ajuste de conexiones' },
  { id: 'cableado', nombre: 'Cableado nuevo (por punto)', precio: 20000, descripcion: 'Tendido de cable para luz o toma' },
];

interface Review {
  id: string;
  nombre_cliente: string;
  calificacion: number;
  comentario: string;
  fecha: string;
  servicio: string;
}

// Mock reviews para demo (despues vienen de la BD)
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    nombre_cliente: 'Maria G.',
    calificacion: 5,
    comentario: 'Excelente trabajo, muy profesional y puntual. Resolvio el problema rapidamente.',
    fecha: '2024-01-15',
    servicio: 'Revision tablero'
  },
  {
    id: '2',
    nombre_cliente: 'Carlos P.',
    calificacion: 5,
    comentario: 'Muy recomendable. Explico todo lo que hizo y dejo todo limpio.',
    fecha: '2024-01-10',
    servicio: 'Cambio de tomacorriente'
  },
  {
    id: '3',
    nombre_cliente: 'Ana L.',
    calificacion: 4,
    comentario: 'Buen trabajo, cumplio con lo acordado.',
    fecha: '2024-01-05',
    servicio: 'Instalacion luminaria'
  },
];

export default function PerfilProfesionalPage() {
  const params = useParams();
  const router = useRouter();
  const profesionalId = params.id as string;

  const [profesional, setProfesional] = useState<Profesional | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (profesionalId) {
      fetchProfesional();
    }
  }, [profesionalId]);

  const fetchProfesional = async () => {
    try {
      const { data, error } = await supabase
        .from('leads_profesionales')
        .select('*')
        .eq('id', profesionalId)
        .single();

      if (data) {
        setProfesional(data);
      }
    } catch (err) {
      console.error('Error fetching profesional:', err);
    } finally {
      setLoading(false);
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
          <p className="text-gray-600 mb-4">Profesional no encontrado</p>
          <Link href="/" className="text-primary-500 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const serviciosVisibles = showAllServices ? SERVICIOS_ELECTRICIDAD : SERVICIOS_ELECTRICIDAD.slice(0, 3);
  const reviewsVisibles = showAllReviews ? MOCK_REVIEWS : MOCK_REVIEWS.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header con back */}
      <div className="bg-secondary-900 text-white py-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-secondary-800 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Perfil profesional</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Header con banner */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-400 h-24 relative">
            {profesional.disponible && (
              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Disponible
              </div>
            )}
          </div>

          {/* Avatar y info */}
          <div className="px-6 pb-6 -mt-12">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                <User className="w-12 h-12 text-primary-600" />
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{profesional.nombre}</h2>
                  <Shield className="w-5 h-5 text-blue-500" title="Verificado" />
                </div>
                <p className="text-gray-500 flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {profesional.oficio || 'Electricista'}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 bg-yellow-50 rounded-xl">
                <div className="flex items-center justify-center gap-1 text-yellow-600">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-xl font-bold">{profesional.calificacion || 5}</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">Calificacion</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl">
                <div className="flex items-center justify-center gap-1 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-xl font-bold">{profesional.trabajos_completados || 47}</span>
                </div>
                <p className="text-xs text-green-700 mt-1">Trabajos</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center justify-center gap-1 text-blue-600">
                  <Clock className="w-5 h-5" />
                  <span className="text-xl font-bold">2h</span>
                </div>
                <p className="text-xs text-blue-700 mt-1">Respuesta</p>
              </div>
            </div>

            {/* Zonas */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Zonas de cobertura
              </p>
              <div className="flex flex-wrap gap-2">
                {(profesional.zonas_cobertura || [profesional.zona]).map((zona, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {zona}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Principal */}
        <Link
          href={`/agendar/${profesional.id}`}
          className="block bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold py-4 px-6 rounded-xl text-center shadow-lg transition-all transform hover:scale-[1.02]"
        >
          <Zap className="w-5 h-5 inline mr-2" />
          Solicitar servicio
        </Link>

        {/* Servicios con precios */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-500" />
            Servicios y precios
          </h3>

          <div className="space-y-3">
            {serviciosVisibles.map((servicio) => (
              <div
                key={servicio.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{servicio.nombre}</p>
                  <p className="text-sm text-gray-500">{servicio.descripcion}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-primary-600 text-lg">
                    ${servicio.precio.toLocaleString('es-AR')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {!showAllServices && SERVICIOS_ELECTRICIDAD.length > 3 && (
            <button
              onClick={() => setShowAllServices(true)}
              className="w-full mt-4 py-2 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center gap-1"
            >
              Ver todos los servicios
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Pago protegido</p>
              <p className="text-xs text-gray-500">Solo pagas si te atiende</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">Verificado</p>
              <p className="text-xs text-gray-500">Identidad confirmada</p>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary-500" />
            Opiniones de clientes
          </h3>

          <div className="space-y-4">
            {reviewsVisibles.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{review.nombre_cliente}</p>
                      <p className="text-xs text-gray-500">{review.servicio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.calificacion
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comentario}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.fecha).toLocaleDateString('es-AR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>

          {!showAllReviews && MOCK_REVIEWS.length > 2 && (
            <button
              onClick={() => setShowAllReviews(true)}
              className="w-full mt-4 py-2 text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center justify-center gap-1"
            >
              Ver todas las opiniones
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Fotos de trabajos (placeholder) */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary-500" />
            Fotos de trabajos
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center"
              >
                <Zap className="w-6 h-6 text-gray-300" />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            Proximamente: fotos de trabajos realizados
          </p>
        </div>

        {/* CTA final */}
        <div className="sticky bottom-4">
          <Link
            href={`/agendar/${profesional.id}`}
            className="block bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold py-4 px-6 rounded-xl text-center shadow-xl transition-all"
          >
            <Zap className="w-5 h-5 inline mr-2" />
            Solicitar servicio ahora
          </Link>
        </div>

        {/* Contacto directo */}
        <div className="flex items-center justify-center gap-4 py-4">
          {profesional.telefono && (
            <a
              href={`https://wa.me/54${profesional.telefono.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-medium">WhatsApp</span>
            </a>
          )}
          {profesional.telefono && (
            <>
              <span className="text-gray-300">|</span>
              <a
                href={`tel:${profesional.telefono}`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
              >
                <Phone className="w-5 h-5" />
                <span className="text-sm font-medium">Llamar</span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
