import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Enermax - Servicios Electricos Profesionales',
  description: 'Soluciones electricas profesionales en Zona Oeste. Instalaciones, reparaciones y mantenimiento electrico. Presupuestos sin cargo.',
  keywords: 'electricista, moreno, lujan, capital federal, instalaciones electricas, reparaciones',
  openGraph: {
    title: 'Enermax - Servicios Electricos Profesionales',
    description: 'Soluciones electricas profesionales en Zona Oeste',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  )
}
