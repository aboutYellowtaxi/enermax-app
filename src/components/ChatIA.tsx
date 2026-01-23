'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, User, MessageCircle, Phone, CheckCircle, Star, MapPin, Briefcase, ArrowLeft } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Profesional {
  id: string;
  nombre: string;
  telefono: string;
  zona: string;
  zonas_cobertura: string[];
  servicios: string[];
  calificacion: number;
  trabajos_completados: number;
  bio: string;
}

interface ChatIAProps {
  onClose: () => void;
}

const SUPABASE_URL = 'https://ptgkjfofknpueepscdrq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Z2tqZm9ma25wdWVlcHNjZHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMjU0MDAsImV4cCI6MjA4NDcwMTQwMH0.QrSmVihF3Srx3IOEzD9BCuFqdLFGXe2K9ulJ6NL5g2s';

// Zonas que reconocemos
const ZONAS = [
  'moreno', 'merlo', 'ituzaingo', 'moron', 'haedo', 'ramos mejia',
  'castelar', 'san justo', 'la matanza', 'lujan', 'mercedes', 'capital',
  'paso del rey', 'la reja', 'francisco alvarez'
];

// Fotos placeholder para profesionales
const FOTOS_PLACEHOLDER = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
];

export default function ChatIA({ onClose }: ChatIAProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy el asistente de Enermax. Decime de que zona sos y te muestro los profesionales disponibles cerca tuyo.'
    }
  ]);
  const [input, setInput] = useState('');
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [showProfesionales, setShowProfesionales] = useState(false);
  const [zonaDetectada, setZonaDetectada] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages, profesionales]);

  // Detectar zona en el mensaje
  const detectarZona = (texto: string): string | null => {
    const textoLower = texto.toLowerCase();
    for (const zona of ZONAS) {
      if (textoLower.includes(zona)) {
        return zona.charAt(0).toUpperCase() + zona.slice(1);
      }
    }
    return null;
  };

  // Buscar profesionales en Supabase
  const buscarProfesionales = async (zona: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/leads_profesionales?disponible=eq.true&select=*`,
        {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filtrar por zona en zonas_cobertura
        const filtered = data.filter((p: Profesional) =>
          p.zonas_cobertura?.some(z => z.toLowerCase() === zona.toLowerCase()) ||
          p.zona.toLowerCase() === zona.toLowerCase()
        );
        setProfesionales(filtered);
        setShowProfesionales(true);
        setZonaDetectada(zona);
      }
    } catch (error) {
      console.error('Error buscando profesionales:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);

    // Detectar zona
    const zona = detectarZona(msg);

    if (zona) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Perfecto, buscando profesionales en ${zona}...`
      }]);
      await buscarProfesionales(zona);
    } else {
      // Si no detecta zona, pedir zona
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'No reconozco esa zona. Decime de que localidad de Zona Oeste sos: Moreno, Merlo, Moron, Ituzaingo, Haedo, etc.'
      }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const contactarProfesional = (prof: Profesional) => {
    const text = encodeURIComponent(
      `Hola ${prof.nombre}! Vi tu perfil en Enermax y necesito un servicio en ${zonaDetectada}. ¿Podemos coordinar?`
    );
    window.open(`https://wa.me/${prof.telefono}?text=${text}`, '_blank');
  };

  const volverAlChat = () => {
    setShowProfesionales(false);
    setProfesionales([]);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '¿Necesitas buscar en otra zona? Decime cual.'
    }]);
  };

  const zonasRapidas = ['Moreno', 'Moron', 'Ituzaingo', 'Merlo'];

  // Vista de profesionales
  if (showProfesionales) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="w-full h-full md:h-[90vh] md:max-h-[800px] md:max-w-2xl lg:max-w-3xl md:rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={volverAlChat} className="p-2 hover:bg-secondary-700 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="font-bold text-lg">Profesionales en {zonaDetectada}</h3>
                <p className="text-sm text-secondary-300">{profesionales.length} disponibles</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-secondary-700 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Profesionales List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {profesionales.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No hay profesionales disponibles en {zonaDetectada} por ahora.</p>
                <button
                  onClick={volverAlChat}
                  className="bg-primary-500 text-secondary-900 font-semibold px-6 py-2 rounded-full"
                >
                  Buscar en otra zona
                </button>
              </div>
            ) : (
              profesionales.map((prof, index) => (
                <div key={prof.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Foto */}
                      <img
                        src={FOTOS_PLACEHOLDER[index % FOTOS_PLACEHOLDER.length]}
                        alt={prof.nombre}
                        className="w-20 h-20 rounded-xl object-cover"
                      />

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{prof.nombre}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {prof.zona}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="font-bold">{prof.calificacion}</span>
                            </div>
                            <p className="text-xs text-gray-500">{prof.trabajos_completados} trabajos</p>
                          </div>
                        </div>

                        {/* Servicios */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {prof.servicios?.map((s, i) => (
                            <span key={i} className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full capitalize">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{prof.bio}</p>

                    {/* Zonas que cubre */}
                    <p className="text-xs text-gray-400 mt-2">
                      Cubre: {prof.zonas_cobertura?.slice(0, 4).join(', ')}{prof.zonas_cobertura?.length > 4 ? '...' : ''}
                    </p>

                    {/* Action */}
                    <button
                      onClick={() => contactarProfesional(prof)}
                      className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Contactar por WhatsApp
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t flex-shrink-0">
            <p className="text-center text-xs text-gray-500">
              Contacta directo al profesional y arreglen el precio entre ustedes
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Vista de chat
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="w-full h-full md:h-[90vh] md:max-h-[800px] md:max-w-2xl lg:max-w-3xl md:rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white p-4 md:p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-secondary-900" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Encontra tu profesional</h3>
              <p className="text-sm text-secondary-300">Electricistas, plomeros y mas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-secondary-700 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-secondary-900" />
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
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-secondary-900" />
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

        {/* Zonas rapidas */}
        {messages.length <= 2 && (
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-500 mb-2">Selecciona tu zona:</p>
            <div className="flex flex-wrap gap-2">
              {zonasRapidas.map((zona) => (
                <button
                  key={zona}
                  onClick={() => {
                    setInput(zona);
                    setMessages(prev => [...prev, { role: 'user', content: `Soy de ${zona}` }]);
                    buscarProfesionales(zona);
                  }}
                  disabled={loading}
                  className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-medium px-4 py-2 rounded-full text-sm transition-all disabled:opacity-50"
                >
                  {zona}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 md:p-5 bg-white border-t border-gray-100 flex-shrink-0">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribi tu zona (ej: Moreno, Moron...)"
              className="flex-1 px-5 py-3 md:py-4 bg-gray-100 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
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
