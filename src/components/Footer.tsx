'use client';

import { Zap, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="bg-primary-500 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-secondary-900" />
              </div>
              <span className="text-xl font-bold">ENERMAX</span>
            </a>
            <p className="text-secondary-400 text-sm">
              Conectamos personas con profesionales verificados
              en todo el pais. Electricidad, plomeria, gas y mas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rapidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#servicios" className="text-secondary-400 hover:text-primary-400 transition-colors text-sm">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#nosotros" className="text-secondary-400 hover:text-primary-400 transition-colors text-sm">
                  Nosotros
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5491131449673?text=Hola!%20Necesito%20un%20electricista."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-400 hover:text-primary-400 transition-colors text-sm"
                >
                  Contactar
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Profesionales</h4>
            <ul className="space-y-2">
              <li className="text-secondary-400 text-sm">Electricistas</li>
              <li className="text-secondary-400 text-sm">Plomeros</li>
              <li className="text-secondary-400 text-sm">Gasistas</li>
              <li className="text-secondary-400 text-sm">Pintores</li>
              <li className="text-secondary-400 text-sm">Contratistas</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-secondary-400 text-sm">
                  Argentina<br />
                  Cobertura nacional
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:+5491131449673" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">
                  11-3144-9673
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:contacto@enermax.com.ar" className="text-secondary-400 hover:text-primary-400 text-sm transition-colors">
                  contacto@enermax.com.ar
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-secondary-400 text-sm">
                  Lun-Sab: 8:00 - 20:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-secondary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-500 text-sm">
            &copy; {currentYear} Enermax. Todos los derechos reservados.
          </p>
          <p className="text-secondary-600 text-xs">
            Profesionales verificados en toda Argentina
          </p>
        </div>
      </div>
    </footer>
  );
}
