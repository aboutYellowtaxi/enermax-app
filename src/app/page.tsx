'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import PresupuestoForm from '@/components/PresupuestoForm';
import CitaForm from '@/components/CitaForm';
import ContactForm from '@/components/ContactForm';
import About from '@/components/About';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  const [activeForm, setActiveForm] = useState<'presupuesto' | 'cita' | null>(null);

  return (
    <main className="min-h-screen">
      <Header />
      <Hero onPresupuesto={() => setActiveForm('presupuesto')} onCita={() => setActiveForm('cita')} />
      <Services />
      <About />

      <section id="presupuesto" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Solicita tu Presupuesto
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Completa el formulario y te contactaremos a la brevedad con un presupuesto sin cargo.
            </p>
          </div>
          <PresupuestoForm />
        </div>
      </section>

      <section id="agendar" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              Agenda una Visita
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Coordina una visita tecnica para evaluar tu proyecto o reparacion.
            </p>
          </div>
          <CitaForm />
        </div>
      </section>

      <section id="contacto" className="py-20 bg-secondary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Contactanos
            </h2>
            <p className="text-secondary-300 max-w-2xl mx-auto">
              Cualquier consulta o duda, no dudes en escribirnos.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
