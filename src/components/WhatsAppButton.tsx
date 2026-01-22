'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '5491100000000'; // Reemplazar con el numero real
  const message = encodeURIComponent('Hola! Me comunico desde la web de Enermax. Quisiera consultar sobre sus servicios.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center gap-2 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        WhatsApp
      </span>
    </a>
  );
}
