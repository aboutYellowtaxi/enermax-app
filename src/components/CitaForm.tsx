'use client';

import { useState } from 'react';
import { Calendar, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { agendarCita, CitaData } from '@/lib/api';

const servicios = [
  'Evaluacion de instalacion electrica',
  'Presupuesto en domicilio',
  'Revision de fallas',
  'Instalacion nueva',
  'Mantenimiento preventivo',
  'Otro'
];

const horarios = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  'A coordinar'
];

const localidades = [
  'Moreno', 'Merlo', 'Ituzaingo', 'Castelar', 'Moron',
  'Haedo', 'Ramos Mejia', 'San Justo', 'La Matanza',
  'Lujan', 'Mercedes', 'Capital Federal', 'Otra'
];

export default function CitaForm() {
  const [formData, setFormData] = useState<CitaData>({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    localidad: '',
    fecha: '',
    horario: '',
    servicio: '',
    notas: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const response = await agendarCita(formData);
      setStatus('success');
      setMessage(response.message);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        localidad: '',
        fecha: '',
        horario: '',
        servicio: '',
        notas: ''
      });
    } catch (error) {
      setStatus('error');
      setMessage('Hubo un error al agendar la cita. Por favor intenta nuevamente.');
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  if (status === 'success') {
    return (
      <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-secondary-900 mb-2">Cita Agendada!</h3>
        <p className="text-secondary-600 mb-6">{message}</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Agendar otra cita
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-8 border border-gray-200">
      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{message}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="cita-nombre" className="block text-sm font-medium text-secondary-700 mb-2">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="cita-nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
            placeholder="Tu nombre"
          />
        </div>

        <div>
          <label htmlFor="cita-telefono" className="block text-sm font-medium text-secondary-700 mb-2">
            Telefono / WhatsApp *
          </label>
          <input
            type="tel"
            id="cita-telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
            placeholder="11-1234-5678"
          />
        </div>

        <div>
          <label htmlFor="cita-email" className="block text-sm font-medium text-secondary-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="cita-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="cita-localidad" className="block text-sm font-medium text-secondary-700 mb-2">
            Localidad *
          </label>
          <select
            id="cita-localidad"
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
          <label htmlFor="cita-direccion" className="block text-sm font-medium text-secondary-700 mb-2">
            Direccion Completa *
          </label>
          <input
            type="text"
            id="cita-direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
            placeholder="Calle, numero, piso/depto"
          />
        </div>

        <div>
          <label htmlFor="cita-fecha" className="block text-sm font-medium text-secondary-700 mb-2">
            Fecha Preferida *
          </label>
          <input
            type="date"
            id="cita-fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            min={today}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
          />
        </div>

        <div>
          <label htmlFor="cita-horario" className="block text-sm font-medium text-secondary-700 mb-2">
            Horario Preferido *
          </label>
          <select
            id="cita-horario"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Selecciona un horario</option>
            {horarios.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="cita-servicio" className="block text-sm font-medium text-secondary-700 mb-2">
            Motivo de la Visita *
          </label>
          <select
            id="cita-servicio"
            name="servicio"
            value={formData.servicio}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white"
          >
            <option value="">Selecciona el motivo</option>
            {servicios.map(serv => (
              <option key={serv} value={serv}>{serv}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="cita-notas" className="block text-sm font-medium text-secondary-700 mb-2">
            Notas Adicionales
          </label>
          <textarea
            id="cita-notas"
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none bg-white"
            placeholder="Algo que debamos saber antes de la visita?"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-8 w-full bg-secondary-900 hover:bg-secondary-800 disabled:bg-secondary-400 text-white font-semibold py-4 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Agendando...
          </>
        ) : (
          <>
            <Calendar className="w-5 h-5" />
            Agendar Visita Tecnica
          </>
        )}
      </button>

      <p className="text-center text-secondary-500 text-sm mt-4">
        Te confirmaremos la cita por WhatsApp o Email
      </p>
    </form>
  );
}
