'use client';

import {
  Zap,
  Lightbulb,
  Power,
  Thermometer,
  Waves,
  Settings,
  AlertTriangle,
  Home
} from 'lucide-react';

const services = [
  {
    icon: AlertTriangle,
    title: 'Solucion de Fallas Electricas',
    description: 'Diagnostico y reparacion de cortes, cortocircuitos, fallas de aislacion y problemas electricos urgentes.',
    price: 'Emergencias 24/7'
  },
  {
    icon: Power,
    title: 'Disyuntor y Termica',
    description: 'Instalacion y reemplazo de disyuntores diferenciales y llaves termicas para proteger tu hogar.',
    price: 'Desde $15.000'
  },
  {
    icon: Zap,
    title: 'Tomacorrientes',
    description: 'Instalacion, reparacion y cambio de tomacorrientes simples, dobles y especiales.',
    price: 'Desde $8.000'
  },
  {
    icon: Lightbulb,
    title: 'Luminarias Interior/Exterior',
    description: 'Colocacion de luces LED, spots, plafones, apliques de pared y luminarias de jardin.',
    price: 'Desde $12.000'
  },
  {
    icon: Home,
    title: 'Cableado Completo',
    description: 'Tendido de cables para luces, tomacorrientes, bombas y equipos especiales.',
    price: 'Presupuesto a medida'
  },
  {
    icon: Waves,
    title: 'Bombas y Piletas',
    description: 'Instalacion de bombas de agua, luces de pileta y sistemas de filtracion.',
    price: 'Desde $25.000'
  },
  {
    icon: Settings,
    title: 'Tableros Electricos',
    description: 'Armado y mantenimiento de tableros principales y secundarios para bombas y equipos.',
    price: 'Desde $35.000'
  },
  {
    icon: Thermometer,
    title: 'Puesta a Tierra',
    description: 'Instalacion de jabalinas y sistemas de puesta a tierra reglamentarios.',
    price: 'Desde $20.000'
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2 mb-4">
            Soluciones Electricas Completas
          </h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            Ofrecemos servicios electricos profesionales para hogares y comercios.
            Todos nuestros trabajos incluyen garantia escrita.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-gray-50 hover:bg-secondary-900 rounded-xl p-6 transition-all duration-300 border border-gray-100 hover:border-secondary-800"
            >
              <div className="bg-primary-500/10 group-hover:bg-primary-500/20 w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-colors">
                <service.icon className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-white mb-2 transition-colors">
                {service.title}
              </h3>
              <p className="text-secondary-600 group-hover:text-secondary-400 text-sm mb-4 transition-colors">
                {service.description}
              </p>
              <span className="text-primary-500 font-medium text-sm">
                {service.price}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#presupuesto"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            Ver todos los servicios y pedir presupuesto
            <span className="text-xl">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
