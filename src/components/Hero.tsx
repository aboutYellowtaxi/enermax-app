'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Phone, Briefcase, Zap } from 'lucide-react';
import ChatIA from './ChatIA';

const serviciosRotativos = ['Electricista', 'Plomero', 'Contratista'];

export default function Hero() {
  const [servicioActual, setServicioActual] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Rotacion de palabras
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setServicioActual((prev) => (prev + 1) % serviciosRotativos.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="gradient-hero min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Heading con texto rotativo */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Necesitas un
            <br />
            <span
              className={`inline-block text-primary-400 transition-all duration-300 ${
                isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              {serviciosRotativos[servicioActual]}?
            </span>
          </h1>

          {/* Subtitulo */}
          <p className="text-xl sm:text-2xl text-secondary-300 mb-10 max-w-2xl mx-auto">
            Conectate con un profesional de tu zona en minutos
          </p>

          {/* BOTON A - CTA Principal */}
          <button
            onClick={() => setShowChat(true)}
            className="group relative inline-flex items-center justify-center gap-3 bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold text-xl sm:text-2xl px-10 sm:px-14 py-5 sm:py-6 rounded-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-primary-500/50 mb-8"
          >
            <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
            <span>Contactar ahora</span>
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
              Online
            </div>
          </button>

          {/* Contacto alternativo */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-secondary-400 mb-16">
            <a
              href="https://wa.me/5491131449673?text=Hola!%20Necesito%20un%20profesional."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-green-400 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp directo</span>
            </a>
            <span className="hidden sm:block">|</span>
            <a
              href="tel:+5491131449673"
              className="flex items-center gap-2 hover:text-primary-400 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>11-3144-9673</span>
            </a>
          </div>

          {/* Separador */}
          <div className="border-t border-secondary-700 pt-10">
            {/* Seccion Sos Profesional */}
            <div className="bg-secondary-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-xl mx-auto border border-secondary-700">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Briefcase className="w-6 h-6 text-primary-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Sos profesional?</h2>
              </div>
              <p className="text-secondary-300 mb-6">
                Unite a nuestra red de tecnicos y recib trabajos en tu zona
              </p>
              <a
                href="#profesional"
                className="inline-flex items-center justify-center gap-2 bg-secondary-700 hover:bg-secondary-600 text-white font-semibold px-8 py-3 rounded-xl transition-all border border-secondary-600"
              >
                <Zap className="w-5 h-5 text-primary-400" />
                Quiero trabajar con Enermax
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Modal */}
      {showChat && <ChatIA onClose={() => setShowChat(false)} />}
    </>
  );
}
