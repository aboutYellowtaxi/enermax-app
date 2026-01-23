'use client';

import { useState } from 'react';
import { Briefcase, CheckCircle, Loader2, Zap, MapPin, Wrench } from 'lucide-react';

const zonas = [
  'Moreno', 'Merlo', 'Ituzaingo', 'Castelar', 'Moron',
  'Haedo', 'Ramos Mejia', 'San Justo', 'La Matanza',
  'Lujan', 'Mercedes', 'Capital Federal', 'Otra zona'
];

const serviciosDisponibles = [
  { id: 'electricidad', label: 'Electricidad' },
  { id: 'plomeria', label: 'Plomeria' },
  { id: 'contratista', label: 'Contratista / Construccion' },
  { id: 'pintura', label: 'Pintura' },
  { id: 'gasista', label: 'Gasista' },
  { id: 'otro', label: 'Otro' },
];

// Supabase config
const SUPABASE_URL = 'https://ptgkjfofknpueepscdrq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_PXMn1B3Mf9rXHdg0QMtdHg_4avInWmi';

export default function ProfesionalForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    zona: '',
    servicios: [] as string[],
    bio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      servicios: prev.servicios.includes(serviceId)
        ? prev.servicios.filter(s => s !== serviceId)
        : [...prev.servicios, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.servicios.length === 0) {
      alert('Selecciona al menos un servicio');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/leads_profesionales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          telefono: formData.telefono,
          email: formData.email || null,
          zona: formData.zona,
          zonas_cobertura: [formData.zona],
          servicios: formData.servicios,
          bio: formData.bio || null,
          disponible: true
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Error al registrar');
      }
    } catch {
      alert('Hubo un error. Intenta de nuevo o contactanos por WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="profesional" className="py-20 bg-secondary-900">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="bg-secondary-800 rounded-2xl p-8 border border-secondary-700">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Registro recibido!</h2>
            <p className="text-secondary-300 mb-6">
              Te contactamos pronto para activar tu perfil y empezar a recibir trabajos.
            </p>
            <a
              href="https://wa.me/5491131449673?text=Hola!%20Me%20acabo%20de%20registrar%20como%20profesional."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Escribinos por WhatsApp
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="profesional" className="py-20 bg-secondary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-500/20 border border-primary-500/30 rounded-full px-4 py-2 mb-4">
            <Briefcase className="w-4 h-4 text-primary-400" />
            <span className="text-primary-400 text-sm font-medium">Para Profesionales</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Sos profesional? Unite a Enermax
          </h2>
          <p className="text-secondary-300 max-w-2xl mx-auto">
            Registrate y empeza a recibir trabajos en tu zona. Sin comisiones por ahora.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Benefits */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-secondary-800/50 p-4 rounded-xl border border-secondary-700">
              <div className="bg-primary-500/20 p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Trabajos en tu zona</h3>
                <p className="text-secondary-400 text-sm">Te conectamos con clientes cerca tuyo</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-secondary-800/50 p-4 rounded-xl border border-secondary-700">
              <div className="bg-primary-500/20 p-3 rounded-lg">
                <Zap className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Clientes verificados</h3>
                <p className="text-secondary-400 text-sm">Gente que realmente necesita tu servicio</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-secondary-800/50 p-4 rounded-xl border border-secondary-700">
              <div className="bg-primary-500/20 p-3 rounded-lg">
                <Wrench className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Vos pones el precio</h3>
                <p className="text-secondary-400 text-sm">Negocias directo con el cliente</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Telefono / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="11-1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Tu zona principal *
                </label>
                <select
                  required
                  value={formData.zona}
                  onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">Selecciona tu zona</option>
                  {zonas.map((zona) => (
                    <option key={zona} value={zona}>{zona}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Servicios que ofreces *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {serviciosDisponibles.map((servicio) => (
                    <button
                      key={servicio.id}
                      type="button"
                      onClick={() => handleServiceToggle(servicio.id)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        formData.servicios.includes(servicio.id)
                          ? 'bg-primary-500 border-primary-500 text-secondary-900'
                          : 'bg-white border-gray-200 text-secondary-600 hover:border-primary-300'
                      }`}
                    >
                      {servicio.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Breve descripcion (opcional)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Contanos sobre tu experiencia..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary-900 hover:bg-secondary-800 disabled:bg-secondary-300 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <Briefcase className="w-5 h-5" />
                    Registrarme como profesional
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
