'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, User, MapPin, MessageCircle, Phone, CheckCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatIAProps {
  onClose: () => void;
}

const WEBHOOK_URL = 'https://n8n.srv1288767.hstgr.cloud/webhook/chat-leonel';

export default function ChatIA({ onClose }: ChatIAProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hola! Soy Leonel, tu tecnico de confianza. Contame que te esta pasando y te doy una solucion ahora mismo. Trabajo con electricidad, plomeria y construccion en toda Zona Oeste.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta');

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || 'Perdon, hubo un error. Escribime por WhatsApp al 11-3144-9673.'
      }]);
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

  const openWhatsApp = () => {
    const lastMessages = messages.slice(-3).map(m =>
      `${m.role === 'user' ? 'Yo' : 'Leonel'}: ${m.content}`
    ).join('\n');
    const text = encodeURIComponent(`Hola Leonel! Vengo del chat de la web.\n\nResumen:\n${lastMessages}`);
    window.open(`https://wa.me/5491131449673?text=${text}`, '_blank');
  };

  const quickMessages = [
    'Tengo un problema electrico',
    'Necesito un plomero urgente',
    'Quiero presupuesto para una obra',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      {/* Chat Container - Mas grande en desktop */}
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
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-700 rounded-full transition-colors"
          >
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
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary-900 font-bold">L</span>
                </div>
              )}
              <div
                className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-secondary-900 text-white rounded-br-md'
                    : 'bg-white text-secondary-800 rounded-bl-md shadow-md border border-gray-100'
                }`}
              >
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

        {/* Quick Messages - Solo si hay pocos mensajes */}
        {messages.length < 3 && (
          <div className="px-4 py-3 bg-white border-t border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-500 mb-2">Respuestas rapidas:</p>
            <div className="flex flex-wrap gap-2">
              {quickMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => setInput(msg)}
                  className="text-sm bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 px-3 py-1.5 rounded-full transition-colors"
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
            onClick={openWhatsApp}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            Seguir por WhatsApp
          </button>
          <a
            href="tel:+5491131449673"
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-secondary-700 text-sm font-medium px-4 py-2.5 rounded-full border border-gray-200 transition-all"
          >
            <Phone className="w-4 h-4" />
            Llamar
          </a>
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
              onClick={sendMessage}
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
