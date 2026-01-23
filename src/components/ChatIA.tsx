'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, User, MessageCircle, Phone, CheckCircle, Calendar, ArrowRight, Shield } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatIAProps {
  onClose: () => void;
}

const WEBHOOK_URL = 'https://n8n.srv1288767.hstgr.cloud/webhook/chat-leonel';
const WEBHOOK_SECRET = 'enermax-secret-2024'; // Clave secreta para seguridad

export default function ChatIA({ onClose }: ChatIAProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hola! Soy Leonel, tu tecnico de confianza. Contame que te esta pasando y te doy una solucion ahora mismo.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', zona: '', problema: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (!showForm) inputRef.current?.focus();
  }, [messages, showForm]);

  // Detectar si la IA pide datos o el usuario quiere dar datos
  const shouldShowForm = (text: string): boolean => {
    const triggers = [
      'pasame tu nombre',
      'pasame tus datos',
      'nombre y telefono',
      'nombre y tel',
      'datos para contactarte',
      'necesito tu nombre',
      'decime tu nombre',
      'tu telefono',
      'tu numero',
      'quiero dar mis datos',
      'te paso mis datos',
      'ahi te paso',
      'te doy mis datos',
      'paso mi numero',
      'mi nombre es',
      'me llamo'
    ];
    const lowerText = text.toLowerCase();
    return triggers.some(trigger => lowerText.includes(trigger));
  };

  // Generar quick messages dinamicos basados en la conversacion
  const getQuickMessages = (): string[] => {
    if (messages.length <= 1) {
      return [
        'Tengo un problema electrico',
        'Necesito un plomero urgente',
        'Quiero presupuesto para una obra',
      ];
    }

    const lastAssistant = messages.filter(m => m.role === 'assistant').slice(-1)[0];
    if (lastAssistant) {
      const text = lastAssistant.content.toLowerCase();

      // Si pide datos o zona
      if (text.includes('zona') || text.includes('donde') || text.includes('localidad')) {
        return ['Moreno', 'Moron', 'Ituzaingo', 'Quiero dar mis datos'];
      }

      // Si habla de visita o presupuesto
      if (text.includes('visita') || text.includes('presupuesto') || text.includes('revisar')) {
        return ['Dale, cuando podes venir?', 'Cuanto sale la visita?', 'Quiero dar mis datos'];
      }

      // Si pregunta detalles del problema
      if (text.includes('que te pasa') || text.includes('contame') || text.includes('detalles')) {
        return ['Se corta la luz', 'Hay una perdida de agua', 'Necesito una instalacion nueva'];
      }
    }

    // Default para conversacion avanzada
    return ['Quiero dar mis datos', 'Cuanto sale?', 'Cuando podes venir?'];
  };

  const sendMessage = async (messageToSend?: string) => {
    const msg = messageToSend || input.trim();
    if (!msg || isLoading) return;

    // Si el usuario quiere dar datos, abrir form
    if (shouldShowForm(msg)) {
      setShowForm(true);
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': WEBHOOK_SECRET // Header secreto
        },
        body: JSON.stringify({
          message: msg,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();
      const aiResponse = data.response || 'Perdon, hubo un error. Escribime por WhatsApp al 11-3144-9673.';

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: aiResponse
      }]);

      // Si la IA pide datos, mostrar form automaticamente
      if (shouldShowForm(aiResponse)) {
        setTimeout(() => setShowForm(true), 1500);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Uh, tuve un problema de conexion. Escribime directo por WhatsApp al 11-3144-9673 y te ayudo!'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickMessage = (msg: string) => {
    if (msg === 'Quiero dar mis datos') {
      setShowForm(true);
    } else {
      sendMessage(msg);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enviar a n8n para guardar en Supabase y hacer matching
    try {
      await fetch('https://n8n.srv1288767.hstgr.cloud/webhook/lead-cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': WEBHOOK_SECRET
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          telefono: formData.telefono,
          zona: formData.zona,
          problema: formData.problema || '',
          servicio: 'general', // Por ahora general, luego podemos agregar selector
          fuente: 'chat-web'
        })
      });
    } catch (error) {
      console.error('Error enviando lead:', error);
    }

    // Tambien abrir WhatsApp para contacto directo
    const text = encodeURIComponent(
      `Hola Leonel! Quiero agendar una visita.\n\n` +
      `Nombre: ${formData.nombre}\n` +
      `Numero: ${formData.telefono}\n` +
      `Zona: ${formData.zona}\n` +
      (formData.problema ? `Problema: ${formData.problema}` : '')
    );

    setFormSubmitted(true);

    setTimeout(() => {
      window.open(`https://wa.me/5491131449673?text=${text}`, '_blank');
    }, 1500);
  };

  const closeFormSuccess = () => {
    setFormSubmitted(false);
    setShowForm(false);
    onClose();
  };

  const openWhatsApp = () => {
    const lastMessages = messages.slice(-3).map(m =>
      `${m.role === 'user' ? 'Yo' : 'Leonel'}: ${m.content}`
    ).join('\n');
    const text = encodeURIComponent(`Hola Leonel! Vengo del chat de la web.\n\nResumen:\n${lastMessages}`);
    window.open(`https://wa.me/5491131449673?text=${text}`, '_blank');
  };

  // Formulario de contacto
  if (showForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          {formSubmitted ? (
            // Confirmacion con boton cerrar
            <div className="p-8 text-center relative">
              <button
                onClick={closeFormSuccess}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Listo!</h2>
              <p className="text-gray-600 mb-6">
                Te estamos redirigiendo a WhatsApp para confirmar tu visita.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Si no se abre automaticamente, <a href="https://wa.me/5491131449673" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">hace click aca</a>.
              </p>
              <button
                onClick={closeFormSuccess}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary-400" />
                  <h2 className="text-lg font-bold">Agendar visita</h2>
                </div>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-secondary-700 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Trust badges */}
              <div className="bg-green-50 px-4 py-3 flex items-center justify-center gap-4 border-b border-green-100">
                <span className="flex items-center gap-1 text-sm text-green-700">
                  <Shield className="w-4 h-4" />
                  Sin compromiso
                </span>
                <span className="flex items-center gap-1 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Presupuesto gratis
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tu nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    placeholder="Como te llamas?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numero *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    placeholder="11-1234-5678"
                  />
                  <p className="text-xs text-gray-500 mt-1">Te contactaremos por WhatsApp</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zona / Barrio *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.zona}
                    onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
                    placeholder="Ej: Moron, Ituzaingo, Moreno..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Que problema tenes? <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <textarea
                    value={formData.problema}
                    onChange={(e) => setFormData({ ...formData, problema: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base resize-none"
                    rows={2}
                    placeholder="Contanos brevemente..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  Coordinar por WhatsApp
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-center text-xs text-gray-500">
                  Te contactamos en menos de 5 minutos
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  const quickMessages = getQuickMessages();

  // Chat normal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full h-full md:h-[90vh] md:max-h-[800px] md:max-w-2xl lg:max-w-3xl md:rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white p-4 md:p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-secondary-900 font-bold text-xl md:text-2xl">L</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-secondary-900"></div>
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl">Leonel - Enermax</h3>
              <p className="text-sm text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Disponible ahora
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary-700 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Trust Banner */}
        <div className="bg-green-50 border-b border-green-100 px-4 py-2 flex items-center justify-center gap-4 text-sm text-green-700 flex-shrink-0">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Respuesta garantizada
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Sin compromiso
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary-900 font-bold">L</span>
                </div>
              )}
              <div className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-secondary-900 text-white rounded-br-md'
                  : 'bg-white text-secondary-800 rounded-bl-md shadow-md border border-gray-100'
              }`}>
                <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-secondary-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-secondary-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <span className="text-secondary-900 font-bold">L</span>
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-bl-md shadow-md border border-gray-100">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Messages - Dinamicos */}
        {messages.length < 6 && (
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-500 mb-2">Respuestas rapidas:</p>
            <div className="flex flex-wrap gap-2">
              {quickMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickMessage(msg)}
                  disabled={isLoading}
                  className={`text-sm px-4 py-2 rounded-full transition-all font-medium ${
                    msg === 'Quiero dar mis datos'
                      ? 'bg-primary-500 hover:bg-primary-600 text-secondary-900 shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  } disabled:opacity-50`}
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-3 md:p-4 bg-gray-100 border-t border-gray-200 flex gap-2 flex-shrink-0">
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-secondary-900 text-sm font-bold px-4 py-3 rounded-full transition-all shadow-md"
          >
            <Calendar className="w-4 h-4" />
            Agendar visita
          </button>
          <button
            onClick={openWhatsApp}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-3 rounded-full transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        </div>

        {/* Input */}
        <div className="p-4 md:p-5 bg-white border-t border-gray-100 flex-shrink-0">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribi tu mensaje..."
              className="flex-1 px-5 py-3 md:py-4 bg-gray-100 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 text-secondary-900 disabled:text-gray-400 p-3 md:p-4 rounded-full transition-colors shadow-md hover:shadow-lg disabled:shadow-none"
            >
              <Send className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
