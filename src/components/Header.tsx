'use client';

import { useState } from 'react';
import { Menu, X, Zap, Phone, MessageCircle } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#nosotros', label: 'Nosotros' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary-900/95 backdrop-blur-sm border-b border-secondary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-secondary-900" />
            </div>
            <span className="text-xl font-bold text-white">ENERMAX</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-secondary-300 hover:text-primary-400 transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+5491131449673" className="flex items-center gap-2 text-secondary-300 hover:text-primary-400 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm">11-3144-9673</span>
            </a>
            <button
              onClick={scrollToTop}
              className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold px-4 py-2 rounded-lg transition-all text-sm"
            >
              Contactar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-secondary-800">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 text-secondary-300 hover:text-primary-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={scrollToTop}
              className="block w-full text-left py-3 text-primary-400 font-medium"
            >
              Dejar mis datos
            </button>
            <div className="flex gap-3 pt-3 border-t border-secondary-800 mt-3">
              <a
                href="https://wa.me/5491131449673?text=Hola!%20Necesito%20un%20electricista."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-lg text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href="tel:+5491131449673"
                className="flex-1 flex items-center justify-center gap-2 bg-secondary-700 text-white py-2 rounded-lg text-sm font-medium"
              >
                <Phone className="w-4 h-4" />
                Llamar
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
