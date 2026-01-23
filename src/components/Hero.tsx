'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Phone, Briefcase, Zap, Clock, Shield, Star } from 'lucide-react';
import ChatIA from './ChatIA';

const serviciosRotativos = ['Electricista', 'Plomero', 'Gasista', 'Pintor', 'Contratista', 'Tecnico'];

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

          {/* Subtitulo con urgencia */}
          <p className="text-xl sm:text-2xl text-secondary-300 mb-4 max-w-2xl mx-auto">
            Te solucionamos el problema <span className="text-primary-400 font-semibold">hoy mismo</span>
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 text-sm text-secondary-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-green-400" />
              Respuesta inmediata
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-blue-400" />
              Garantia de trabajo
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              Profesionales verificados
            </span>
          </div>

          {/* BOTON A - CTA Principal GRANDE */}
          <div className="relative inline-block mb-6">
            <button
              onClick={() => setShowChat(true)}
              className="group relative inline-flex items-center justify-center gap-3 bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold text-xl sm:text-2xl px-12 sm:px-16 py-6 sm:py-7 rounded-2xl transition-all transform hover:scale-105 shadow-2xl hover:shadow-primary-500/50 animate-pulse-slow"
            >
              <MessageCircle className="w-8 h-8 sm:w-9 sm:h-9" />
              <span>Habla con un experto GRATIS</span>
            </button>
            {/* Badge Online */}
            <div className="absolute -top-3 -right-3 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              <span className="w-2 h-2 bg-white rounded-full absolute"></span>
              <span className="ml-2">Online</span>
            </div>
          </div>

          {/* Urgencia */}
          <p className="text-secondary-400 text-sm mb-8">
            Sin compromiso - Te decimos precio y disponibilidad al instante
          </p>

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
                Unite a nuestra red de tecnicos y recibi trabajos en tu zona
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
