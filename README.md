# Enermax - Servicios Electricos

Aplicacion web para Enermax, servicio de electricistas profesionales en Zona Oeste (Buenos Aires).

## Funcionalidades

- Landing page con informacion de servicios
- Formulario de solicitud de presupuesto
- Formulario de agenda de visitas tecnicas
- Formulario de contacto
- Integracion con n8n para procesamiento de leads
- Boton flotante de WhatsApp

## Tecnologias

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons

## Backend (n8n)

Los formularios se conectan a webhooks de n8n:
- `/webhook/enermax-presupuesto` - Solicitudes de presupuesto
- `/webhook/enermax-cita` - Agendar visitas
- `/webhook/enermax-contacto` - Mensajes de contacto

## Instalacion

```bash
npm install
npm run dev
```

## Deploy en Vercel

1. Conectar el repositorio de GitHub a Vercel
2. El deploy es automatico con cada push a main

## Estructura

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── About.tsx
│   ├── PresupuestoForm.tsx
│   ├── CitaForm.tsx
│   ├── ContactForm.tsx
│   ├── WhatsAppButton.tsx
│   └── Footer.tsx
└── lib/
    └── api.ts
```
