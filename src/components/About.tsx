'use client';

import { MapPin, Award, Users, Clock, Wrench, Zap, Shield } from 'lucide-react';

const stats = [
  { icon: Users, value: '+500', label: 'Clientes Satisfechos' },
  { icon: Award, value: '+50', label: 'Profesionales Verificados' },
  { icon: Clock, value: '24/7', label: 'Disponibilidad' },
  { icon: MapPin, value: 'ARG', label: 'Cobertura Nacional' },
];

const zonas = [
  'Capital Federal', 'La Plata', 'Quilmes', 'Lanus', 'Moreno', 'Moron',
  'Tigre', 'Pilar', 'Cordoba', 'Rosario', 'Mendoza', 'Mar del Plata'
];

const competencias = [
  'Instalaciones electricas',
  'Tableros electricos',
  'Soldadura SMAW y MIG',
  'Lectura de planos',
  'Mantenimiento industrial',
  'Normas de seguridad'
];

export default function About() {
  return (
    <section id="nosotros" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Seccion Principal */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Content */}
          <div>
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
              Sobre Nosotros
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-6">
              Profesionales Electricos de Confianza
            </h2>
            <p className="text-secondary-600 mb-6">
              En <strong>Enermax</strong> conectamos a personas con profesionales verificados
              en electricidad, plomeria y servicios del hogar. Nuestra red de tecnicos con
              experiencia cubre todo el pais, desde Buenos Aires hasta el interior de Argentina.
            </p>
            <p className="text-secondary-600 mb-8">
              Nos especializamos en soluciones electricas seguras y duraderas. Capacidad de
              aprendizaje rapido, adaptacion y compromiso total con la calidad y seguridad
              de cada trabajo.
            </p>

            {/* Trust Points */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-secondary-700">Tecnico en Electricidad - E.E.T. N°2 Moreno</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-secondary-700">Experiencia en instalaciones domiciliarias e industriales</span>
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
                <span className="text-secondary-700">Compromiso con calidad y normas de seguridad</span>
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

        {/* Experiencia y Competencias */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Experiencia */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center gap-3">
              <Wrench className="w-6 h-6 text-primary-500" />
              Experiencia Profesional
            </h3>

            <div className="space-y-6">
              <div className="border-l-2 border-primary-500 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-primary-500" />
                  <span className="font-semibold text-secondary-900">Electricista Domiciliario</span>
                </div>
                <p className="text-sm text-secondary-500 mb-2">2024 - Presente</p>
                <ul className="text-sm text-secondary-600 space-y-1">
                  <li>Instalacion y mantenimiento de tableros electricos</li>
                  <li>Cableado estructural y reparacion de fallas</li>
                  <li>Instalacion de luminarias y sistemas de proteccion</li>
                </ul>
              </div>

              <div className="border-l-2 border-secondary-300 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-secondary-500" />
                  <span className="font-semibold text-secondary-900">Tecnico en Mantenimiento Industrial</span>
                </div>
                <p className="text-sm text-secondary-500 mb-2">2018 - 2020</p>
                <ul className="text-sm text-secondary-600 space-y-1">
                  <li>Soldadura SMAW y MIG para reparaciones</li>
                  <li>Mantenimiento de sistemas mecanicos</li>
                  <li>Trabajo bajo normas de seguridad industrial</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Competencias */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center gap-3">
              <Award className="w-6 h-6 text-primary-500" />
              Competencias Tecnicas
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {competencias.map((comp, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-secondary-700">{comp}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
              <p className="text-sm text-secondary-700">
                <strong className="text-primary-600">Formacion:</strong> Tecnico en Electricidad /
                Electromecanica - Escuela Secundaria Tecnica N° 2 de Moreno
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
