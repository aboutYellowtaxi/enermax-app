'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Zap, Phone, MessageCircle, User, LogIn, Briefcase, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, usuario, loading, isProfesional, signOut } = useAuth();

  const navLinks = [
    { href: '/conectar', label: 'Buscar profesional' },
    { href: '/profesionales', label: 'Ver todos' },
  ];

  const dashboardLink = isProfesional ? '/dashboard/profesional' : '/dashboard/cliente';

  const handleLogout = async () => {
    await signOut();
    setShowUserMenu(false);
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-secondary-900/95 backdrop-blur-sm border-b border-secondary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary-500 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-secondary-900" />
            </div>
            <span className="text-xl font-bold text-white">ENERMAX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-secondary-300 hover:text-primary-400 transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {!loading && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-secondary-300 hover:text-primary-400 transition-colors px-3 py-2 rounded-lg hover:bg-secondary-800"
                  >
                    <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
                      {isProfesional ? (
                        <Briefcase className="w-4 h-4 text-primary-400" />
                      ) : (
                        <User className="w-4 h-4 text-primary-400" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{usuario?.nombre?.split(' ')[0] || 'Mi cuenta'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-secondary-800 rounded-xl shadow-lg py-1 border border-secondary-700">
                      <Link
                        href={dashboardLink}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-300 hover:bg-secondary-700 hover:text-white"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {isProfesional ? 'Mi panel' : 'Mis solicitudes'}
                      </Link>
                      <hr className="my-1 border-secondary-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-secondary-700"
                      >
                        <LogIn className="w-4 h-4 rotate-180" />
                        Cerrar sesion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-secondary-300 hover:text-primary-400 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="text-sm">Iniciar sesion</span>
                </Link>
              )
            )}
            <Link
              href="/conectar"
              className="bg-primary-500 hover:bg-primary-400 text-secondary-900 font-semibold px-4 py-2 rounded-lg transition-all text-sm flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Solicitar servicio
            </Link>
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
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 text-secondary-300 hover:text-primary-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Auth links mobile */}
            {!loading && (
              user ? (
                <>
                  <Link
                    href={dashboardLink}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 py-3 text-primary-400 font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    {isProfesional ? 'Mi panel de profesional' : 'Mis solicitudes'}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 py-3 text-red-400"
                  >
                    <LogIn className="w-4 h-4 rotate-180" />
                    Cerrar sesion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 py-3 text-primary-400 font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar sesion
                </Link>
              )
            )}

            {/* CTA principal mobile */}
            <div className="pt-3 border-t border-secondary-800 mt-3">
              <Link
                href="/conectar"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-primary-500 text-secondary-900 py-3 rounded-lg text-sm font-bold"
              >
                <Zap className="w-4 h-4" />
                Solicitar servicio ahora
              </Link>
            </div>

            <div className="flex gap-3 pt-3">
              <a
                href="https://wa.me/5491131449673?text=Hola!%20Necesito%20un%20profesional."
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
