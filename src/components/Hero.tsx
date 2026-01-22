'use client';

import { Zap, Shield, Clock, MapPin } from 'lucide-react';

interface HeroProps {
  onPresupuesto: () => void;
  onCita: () => void;
}

export default function Hero({ onPresupuesto, onCita }: HeroProps) {
  const features = [
    { icon: Shield, text: 'Profesionales Matriculados' },
    { icon: Clock, text: 'Emergencias 24/7' },
    { icon: MapPin, text: 'Lujan a Capital Federal' },
  ];

  return (
    <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-primary-400" />
            <span className="text-primary-400 text-sm font-medium">Servicios Electricos Profesionales</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Soluciones Electricas
            <br />
            <span className="text-primary-400">Confiables y Seguras</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-secondary-300 mb-8 max-w-2xl mx-auto">
            Instalaciones, reparaciones y mantenimiento electrico en Zona Oeste.
            Basados en Moreno, cubrimos desde Lujan hasta Capital Federal.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#presupuesto"
              className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold px-8 py-4 rounded-lg transition-all electric-glow"
            >
              <Zap className="w-5 h-5" />
              Pedir Presupuesto Gratis
            </a>
            <a
              href="#agendar"
              className="inline-flex items-center justify-center gap-2 bg-secondary-700 hover:bg-secondary-600 text-white font-semibold px-8 py-4 rounded-lg transition-all border border-secondary-600"
            >
              Agendar Visita Tecnica
            </a>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-secondary-400">
                <feature.icon className="w-5 h-5 text-primary-400" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
