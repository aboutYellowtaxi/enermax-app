'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { enviarPresupuesto, PresupuestoData } from '@/lib/api';

const servicios = [
  'Solucion de fallas electricas',
  'Instalacion de disyuntor/termica',
  'Tomacorrientes',
  'Luminarias interior/exterior',
  'Cableado electrico',
  'Bombas y piletas',
  'Tableros electricos',
  'Puesta a tierra',
  'Otro'
];

const localidades = [
  'Moreno', 'Merlo', 'Ituzaingo', 'Castelar', 'Moron',
  'Haedo', 'Ramos Mejia', 'San Justo', 'La Matanza',
  'Lujan', 'Mercedes', 'Capital Federal', 'Otra'
];

export default function PresupuestoForm() {
  const [formData, setFormData] = useState<PresupuestoData>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    localidad: '',
    servicio: '',
    descripcion: '',
    urgente: false
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await enviarPresupuesto(formData);
      setStatus('success');
      setMessage(response.message);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        localidad: '',
        servicio: '',
        descripcion: '',
        urgente: false
      });
    } catch (error) {
      setStatus('error');
      setMessage('Hubo un error al enviar tu solicitud. Por favor intenta nuevamente.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-secondary-900 mb-2">Solicitud Enviada!</h3>
        <p className="text-secondary-600 mb-6">{message}</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{message}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-secondary-700 mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-secondary-700 mb-2">
            Telefono / WhatsApp *
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="11-1234-5678"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="localidad" className="block text-sm font-medium text-secondary-700 mb-2">
            Localidad *
          </label>
          <select
            id="localidad"
            name="localidad"
            value={formData.localidad}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Selecciona tu localidad</option>
            {localidades.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="direccion" className="block text-sm font-medium text-secondary-700 mb-2">
            Direccion
          </label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            placeholder="Calle y numero"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="servicio" className="block text-sm font-medium text-secondary-700 mb-2">
            Tipo de Servicio *
          </label>
          <select
            id="servicio"
            name="servicio"
            value={formData.servicio}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Selecciona el servicio</option>
            {servicios.map(serv => (
              <option key={serv} value={serv}>{serv}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="descripcion" className="block text-sm font-medium text-secondary-700 mb-2">
            Descripcion del Trabajo *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Describe lo que necesitas: que problema tenes, cuantos puntos de luz, etc."
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="urgente"
              checked={formData.urgente}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-secondary-700">
              Es urgente (necesito atencion lo antes posible)
            </span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-8 w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-secondary-900 font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Solicitar Presupuesto Gratis
          </>
        )}
      </button>

      <p className="text-center text-secondary-500 text-sm mt-4">
        Te contactaremos dentro de las proximas 24 horas
      </p>
    </form>
  );
}
