'use client';

import { useState } from 'react';
import { Zap, Shield, Clock, MapPin, Phone, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfFEk6e7bo72CuQkKc84tFtYyr_CMTqXRBe43xnOsZpecoRiQ/formResponse';

const zonas = [
  'Moreno', 'Merlo', 'Ituzaingo', 'Castelar', 'Moron',
  'Haedo', 'Ramos Mejia', 'San Justo', 'La Matanza',
  'Lujan', 'Mercedes', 'Capital Federal', 'Otra zona'
];

const servicios = [
  'Falla electrica / Emergencia',
  'Instalacion de termica/disyuntor',
  'Tomacorrientes',
  'Iluminacion',
  'Cableado',
  'Tablero electrico',
  'Bomba / Pileta',
  'Otro servicio'
];

export default function Hero() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    zona: '',
    servicio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formBody = new URLSearchParams();
    formBody.append('entry.1135063153', formData.nombre);
    formBody.append('entry.1644906803', formData.telefono);
    formBody.append('entry.823661994', formData.zona);
    formBody.append('entry.1034138782', formData.servicio);

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formBody.toString()
      });
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { icon: Shield, text: 'Tecnicos Matriculados' },
    { icon: Clock, text: 'Respuesta Rapida' },
    { icon: MapPin, text: 'Lujan a Capital Federal' },
  ];

  if (isSubmitted) {
    return (
      <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24 min-h-[80vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">Recibimos tus datos!</h2>
            <p className="text-secondary-600 mb-6">Te llamamos en breve para coordinar.</p>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5491131449673?text=Hola!%20Acabo%20de%20dejar%20mis%20datos%20en%20la%20web."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Escribinos por WhatsApp
              </a>
              <a
                href="tel:+5491131449673"
                className="inline-flex items-center justify-center gap-2 text-secondary-600 hover:text-secondary-900 font-medium"
              >
                <Phone className="w-4 h-4" />
                o llama al 11-3144-9673
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="gradient-hero pt-24 pb-16 md:pt-32 md:pb-24 min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-primary-400 text-sm font-medium">Electricistas Zona Oeste</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Necesitas un
              <br />
              <span className="text-primary-400">Electricista?</span>
            </h1>

            <p className="text-xl text-secondary-300 mb-8">
              Dejanos tus datos y <strong className="text-white">te llamamos en minutos</strong> para resolver tu problema electrico.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-secondary-800/50 px-4 py-2 rounded-full">
                  <feature.icon className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-secondary-300">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Alternative Contact - Desktop */}
            <div className="hidden lg:flex items-center gap-4 text-secondary-400">
              <span>O contactanos directo:</span>
              <a
                href="https://wa.me/5491131449673?text=Hola!%20Necesito%20un%20electricista."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
              <span>|</span>
              <a
                href="tel:+5491131449673"
                className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
              >
                <Phone className="w-5 h-5" />
                11-3144-9673
              </a>
            </div>
          </div>

          {/* Right - Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-secondary-900">Te llamamos gratis</h2>
                <p className="text-secondary-500 text-sm mt-1">Completa tus datos y te contactamos</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Juan Perez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Tu telefono
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="11-1234-5678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Tu zona
                  </label>
                  <select
                    required
                    value={formData.zona}
                    onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Selecciona tu zona</option>
                    {zonas.map((zona) => (
                      <option key={zona} value={zona}>{zona}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Que necesitas?
                  </label>
                  <select
                    required
                    value={formData.servicio}
                    onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Selecciona un servicio</option>
                    {servicios.map((servicio) => (
                      <option key={servicio} value={servicio}>{servicio}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-secondary-900 font-bold py-4 rounded-lg transition-all text-lg flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      QUIERO QUE ME LLAMEN
                    </>
                  )}
                </button>
              </form>

              {/* Alternative Contact - Mobile */}
              <div className="lg:hidden mt-6 pt-6 border-t border-gray-100">
                <p className="text-center text-secondary-500 text-sm mb-3">O contactanos directo</p>
                <div className="flex gap-3">
                  <a
                    href="https://wa.me/5491131449673?text=Hola!%20Necesito%20un%20electricista."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </a>
                  <a
                    href="tel:+5491131449673"
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-900 font-semibold py-3 rounded-lg transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    Llamar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
