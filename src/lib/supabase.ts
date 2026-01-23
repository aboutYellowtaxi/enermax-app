import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ptgkjfofknpueepscdrq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0Z2tqZm9ma25wdWVlcHNjZHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMjU0MDAsImV4cCI6MjA4NDcwMTQwMH0.QrSmVihF3Srx3IOEzD9BCuFqdLFGXe2K9ulJ6NL5g2s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Usuario {
  id: string;
  auth_id: string;
  tipo: 'cliente' | 'profesional';
  nombre: string;
  telefono?: string;
  email?: string;
  profesional_id?: string;
  created_at: string;
}

export interface Profesional {
  id: string;
  nombre: string;
  telefono: string;
  zona: string;
  zonas_cobertura: string[];
  servicios: string[];
  calificacion: number;
  trabajos_completados: number;
  bio?: string;
  disponible: boolean;
}

export interface Disponibilidad {
  id: string;
  profesional_id: string;
  dia_semana: number; // 0=domingo, 1=lunes, etc
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
}

export interface Cita {
  id: string;
  cliente_id: string;
  profesional_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  servicio?: string;
  descripcion?: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada' | 'completada' | 'cancelada';
  precio_estimado?: number;
  notas_profesional?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profesional?: Profesional;
  cliente?: Usuario;
}
