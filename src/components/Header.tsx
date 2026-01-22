'use client';

import { useState } from 'react';
import { Menu, X, Zap, Phone } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#nosotros', label: 'Nosotros' },
    { href: '#presupuesto', label: 'Presupuesto' },
    { href: '#agendar', label: 'Agendar Visita' },
    { href: '#contacto', label: 'Contacto' },
  ];

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

          {/* Phone CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary-400" />
            <a href="tel:+5491131449673" className="text-white font-medium hover:text-primary-400 transition-colors">
              11-3144-9673
            </a>
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
            <a
              href="tel:+5491131449673"
              className="flex items-center gap-2 py-3 text-primary-400 font-medium"
            >
              <Phone className="w-4 h-4" />
              11-3144-9673
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
