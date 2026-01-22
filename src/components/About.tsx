'use client';

import { MapPin, Award, Users, Clock } from 'lucide-react';

const stats = [
  { icon: Users, value: '+500', label: 'Clientes Satisfechos' },
  { icon: Award, value: '+10', label: 'Anos de Experiencia' },
  { icon: Clock, value: '24/7', label: 'Disponibilidad' },
  { icon: MapPin, value: '50km', label: 'Radio de Cobertura' },
];

const zonas = [
  'Moreno', 'Merlo', 'Ituzaingo', 'Castelar', 'Moron',
  'Haedo', 'Ramos Mejia', 'San Justo', 'La Matanza',
  'Lujan', 'Mercedes', 'Capital Federal'
];

export default function About() {
  return (
    <section id="nosotros" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
              Sobre Nosotros
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-6">
              Profesionales Electricos de Confianza
            </h2>
            <p className="text-secondary-600 mb-6">
              En <strong>Enermax</strong> somos tecnicos electricos matriculados con mas de 10 anos
              de experiencia en instalaciones residenciales y comerciales. Estamos basados en
              <strong> Moreno</strong> y brindamos servicio en toda la Zona Oeste, desde Lujan
              hasta Capital Federal.
            </p>
            <p className="text-secondary-600 mb-8">
              Nos especializamos en soluciones electricas seguras y duraderas. Todos nuestros
              trabajos cuentan con garantia escrita y utilizamos materiales de primera calidad.
            </p>

            {/* Trust Points */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-secondary-700">Tecnicos matriculados y certificados</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-secondary-700">Garantia escrita en todos los trabajos</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-secondary-700">Presupuestos sin cargo y sin compromiso</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-secondary-700">Materiales de primera calidad</span>
              </div>
            </div>
          </div>

          {/* Stats and Map */}
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                  <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-secondary-900">{stat.value}</div>
                  <div className="text-secondary-500 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Coverage Area */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" />
                Zonas de Cobertura
              </h3>
              <div className="flex flex-wrap gap-2">
                {zonas.map((zona, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-secondary-700 px-3 py-1 rounded-full text-sm"
                  >
                    {zona}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
