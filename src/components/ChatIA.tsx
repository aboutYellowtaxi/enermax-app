'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, User, MapPin, MessageCircle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatIAProps {
  onClose: () => void;
}

const WEBHOOK_URL = 'https://n8n.srv1288767.hstgr.cloud/webhook/enermax-chat-ia';

export default function ChatIA({ onClose }: ChatIAProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hola amigo! Soy Leonel de Enermax. Contame, que problema tenes? Te ayudo con electricidad, plomeria o lo que necesites.'
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-secondary-900 text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-secondary-900 font-bold text-lg">L</span>
            </div>
            <div>
              <h3 className="font-semibold">Leonel - Enermax</h3>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Online ahora
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary-900 font-bold text-sm">L</span>
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-secondary-900 text-white rounded-br-md'
                    : 'bg-white text-secondary-800 rounded-bl-md shadow-sm border border-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-secondary-600" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <span className="text-secondary-900 font-bold text-sm">L</span>
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-3 bg-gray-100 border-t border-gray-200 flex gap-2 flex-shrink-0">
          <button
            onClick={openWhatsApp}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
          <button
            onClick={() => setInput('Quiero agendar una visita')}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-secondary-700 text-sm font-medium px-4 py-2 rounded-full border border-gray-200 transition-all"
          >
            <MapPin className="w-4 h-4" />
            Agendar visita
          </button>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribi tu mensaje..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 text-secondary-900 disabled:text-gray-400 p-3 rounded-full transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
