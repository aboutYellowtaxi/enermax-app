'use client';

import { useState } from 'react';
import { MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { enviarContacto, ContactoData } from '@/lib/api';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactoData>({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await enviarContacto(formData);
      setStatus('success');
      setMessage(response.message);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });
    } catch (error) {
      setStatus('error');
      setMessage('Hubo un error al enviar tu mensaje. Por favor intenta nuevamente.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-secondary-800 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Mensaje Enviado!</h3>
        <p className="text-secondary-300 mb-6">{message}</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-primary-400 hover:text-primary-300 font-medium"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-secondary-800 rounded-xl p-8">
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300">{message}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contacto-nombre" className="block text-sm font-medium text-secondary-300 mb-2">
            Nombre *
          </label>
          <input
            type="text"
            id="contacto-nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-white placeholder-secondary-400"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label htmlFor="contacto-telefono" className="block text-sm font-medium text-secondary-300 mb-2">
            Telefono *
          </label>
          <input
            type="tel"
            id="contacto-telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-white placeholder-secondary-400"
            placeholder="11-1234-5678"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contacto-email" className="block text-sm font-medium text-secondary-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="contacto-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-white placeholder-secondary-400"
            placeholder="tu@email.com"
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="contacto-mensaje" className="block text-sm font-medium text-secondary-300 mb-2">
            Mensaje *
          </label>
          <textarea
            id="contacto-mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 bg-secondary-700 border border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-white placeholder-secondary-400 resize-none"
            placeholder="En que podemos ayudarte?"
          />
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
            <MessageSquare className="w-5 h-5" />
            Enviar Mensaje
          </>
        )}
      </button>
    </form>
  );
}
