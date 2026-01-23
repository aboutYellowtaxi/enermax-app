'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Send, User, MessageCircle, Star, MapPin, Briefcase, ArrowLeft, CheckCircle, Shield, Calendar, Phone } from 'lucide-react';

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

const ZONAS = [
  // GBA Oeste
  'moreno', 'merlo', 'ituzaingo', 'moron', 'haedo', 'ramos mejia', 'castelar',
  'san justo', 'la matanza', 'hurlingham', 'tres de febrero', 'paso del rey',
  'la reja', 'francisco alvarez', 'lujan', 'mercedes', 'general rodriguez',
  // GBA Norte
  'san isidro', 'vicente lopez', 'tigre', 'san fernando', 'pilar', 'escobar',
  'san miguel', 'jose c. paz', 'malvinas argentinas', 'san martin',
  // GBA Sur
  'quilmes', 'lanus', 'avellaneda', 'lomas de zamora', 'florencio varela',
  'berazategui', 'almirante brown', 'esteban echeverria', 'ezeiza',
  // La Plata
  'la plata', 'ensenada', 'berisso', 'city bell', 'gonnet',
  // CABA
  'capital federal', 'capital', 'caba', 'palermo', 'belgrano', 'recoleta',
  'caballito', 'flores', 'villa urquiza', 'almagro', 'barracas', 'la boca', 'san telmo',
  // Interior Buenos Aires
  'mar del plata', 'bahia blanca', 'tandil', 'olavarria', 'necochea',
  // Otras provincias
  'cordoba', 'rosario', 'mendoza', 'tucuman', 'salta', 'santa fe',
  'san juan', 'neuquen', 'bariloche', 'ushuaia', 'posadas', 'corrientes',
  'resistencia', 'parana', 'formosa', 'san luis', 'la rioja', 'catamarca',
  'santiago del estero', 'jujuy', 'rio gallegos', 'rawson', 'viedma',
  'santa rosa', 'comodoro rivadavia'
];

export default function ChatIA({ onClose }: ChatIAProps) {
  const router = useRouter();
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
  const [mostrandoCercanos, setMostrandoCercanos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProf, setSelectedProf] = useState<Profesional | null>(null);
  const [leadForm, setLeadForm] = useState({ nombre: '', telefono: '' });
  const [leadSent, setLeadSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages, profesionales]);

  const detectarZona = (texto: string): string | null => {
    const textoLower = texto.toLowerCase();
    for (const zona of ZONAS) {
      if (textoLower.includes(zona)) {
        return zona.charAt(0).toUpperCase() + zona.slice(1);
      }
    }
    return null;
  };

  const buscarProfesionales = async (zona: string) => {
    setLoading(true);
    setMostrandoCercanos(false);
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
        const filtered = data.filter((p: Profesional) =>
          p.zonas_cobertura?.some(z => z.toLowerCase() === zona.toLowerCase()) ||
          p.zona.toLowerCase() === zona.toLowerCase()
        );

        // Si no hay profesionales en la zona exacta, mostrar todos los disponibles
        if (filtered.length === 0 && data.length > 0) {
          setProfesionales(data);
          setMostrandoCercanos(true);
        } else {
          setProfesionales(filtered);
        }
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

    const zona = detectarZona(msg);

    if (zona) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Perfecto, buscando profesionales en ${zona}...`
      }]);
      await buscarProfesionales(zona);
    } else {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'No reconozco esa zona. Decime de que localidad sos: Capital, Palermo, Moreno, Quilmes, La Plata, Cordoba, Rosario, etc.'
      }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleContactar = (prof: Profesional) => {
    setSelectedProf(prof);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProf) return;

    // Guardar lead en Supabase
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/leads_clientes`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          nombre: leadForm.nombre,
          telefono: leadForm.telefono,
          zona: zonaDetectada,
          servicio_requerido: selectedProf.servicios?.[0] || 'general',
          descripcion: `Contacto con ${selectedProf.nombre}`,
          estado: 'nuevo'
        })
      });
    } catch (error) {
      console.error('Error guardando lead:', error);
    }

    setLeadSent(true);

    // Abrir WhatsApp despues de un momento
    setTimeout(() => {
      const text = encodeURIComponent(
        `Hola ${selectedProf.nombre}! Soy ${leadForm.nombre}, vi tu perfil en Enermax.\n\nNecesito un servicio en ${zonaDetectada}. Mi numero es ${leadForm.telefono}. ¿Podemos coordinar?`
      );
      window.open(`https://wa.me/${selectedProf.telefono}?text=${text}`, '_blank');
    }, 1500);
  };

  const volverAlChat = () => {
    setShowProfesionales(false);
    setProfesionales([]);
    setSelectedProf(null);
    setLeadSent(false);
    setLeadForm({ nombre: '', telefono: '' });
    setMostrandoCercanos(false);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '¿Necesitas buscar en otra zona? Decime cual.'
    }]);
  };

  const zonasRapidas = ['Capital', 'La Plata', 'Quilmes', 'Moreno'];

  // Form para captar datos antes de WhatsApp
  if (selectedProf) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
          {leadSent ? (
            <div className="p-8 text-center">
              <button
                onClick={() => { setSelectedProf(null); setLeadSent(false); }}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Listo!</h2>
              <p className="text-gray-600 mb-6">
                Te estamos conectando con {selectedProf.nombre} por WhatsApp.
              </p>
              <button
                onClick={volverAlChat}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl"
              >
                Buscar otro profesional
              </button>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setSelectedProf(null)} className="p-1 hover:bg-secondary-700 rounded-full">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="font-bold">Contactar a {selectedProf.nombre}</h2>
                  </div>
                  <button onClick={onClose} className="p-1 hover:bg-secondary-700 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-green-50 px-4 py-3 flex items-center justify-center gap-4 border-b border-green-100">
                <span className="flex items-center gap-1 text-sm text-green-700">
                  <Shield className="w-4 h-4" />
                  Tus datos estan seguros
                </span>
              </div>

              <form onSubmit={handleLeadSubmit} className="p-6 space-y-4">
                <p className="text-gray-600 text-sm mb-4">
                  Dejanos tus datos para que {selectedProf.nombre} pueda contactarte:
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tu nombre *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.nombre}
                    onChange={(e) => setLeadForm({ ...leadForm, nombre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Como te llamas?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tu numero *</label>
                  <input
                    type="tel"
                    required
                    value={leadForm.telefono}
                    onChange={(e) => setLeadForm({ ...leadForm, telefono: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="11-1234-5678"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contactar por WhatsApp
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  // Vista de profesionales
  if (showProfesionales) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
        <div className="w-full h-full md:h-[90vh] md:max-h-[800px] md:max-w-2xl lg:max-w-3xl md:rounded-3xl bg-white shadow-2xl flex flex-col overflow-hidden">

          <div className="bg-gradient-to-r from-secondary-900 to-secondary-800 text-white p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={volverAlChat} className="p-2 hover:bg-secondary-700 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h3 className="font-bold text-lg">
                  {mostrandoCercanos ? `Profesionales cercanos a ${zonaDetectada}` : `Profesionales en ${zonaDetectada}`}
                </h3>
                <p className="text-sm text-secondary-300">{profesionales.length} disponibles</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-secondary-700 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          {mostrandoCercanos && (
            <div className="bg-amber-50 border-b border-amber-100 px-4 py-3">
              <p className="text-amber-800 text-sm text-center">
                No encontramos profesionales en {zonaDetectada}, pero estos trabajan en zonas cercanas
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {profesionales.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Todavia no tenemos profesionales en esta zona.</p>
                <p className="text-gray-400 text-sm mb-4">Estamos expandiendo nuestra red constantemente.</p>
                <button
                  onClick={volverAlChat}
                  className="bg-primary-500 text-secondary-900 font-semibold px-6 py-2 rounded-full"
                >
                  Buscar en otra zona
                </button>
              </div>
            ) : (
              profesionales.map((prof) => (
                <div key={prof.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-4">
                  <div className="flex items-start justify-between mb-3">
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

                  <div className="flex flex-wrap gap-1 mb-3">
                    {prof.servicios?.map((s, i) => (
                      <span key={i} className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full capitalize">
                        {s}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{prof.bio}</p>

                  <p className="text-xs text-gray-400 mb-4">
                    Cubre: {prof.zonas_cobertura?.slice(0, 4).join(', ')}{prof.zonas_cobertura?.length > 4 ? '...' : ''}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleContactar(prof)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      Urgente
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        router.push(`/agendar/${prof.id}`);
                      }}
                      className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 text-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      Agendar cita
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-white border-t flex-shrink-0">
            <p className="text-center text-xs text-gray-500">
              <span className="font-medium">Urgente:</span> WhatsApp directo | <span className="font-medium">Agendar:</span> Reserva con fecha y hora
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
