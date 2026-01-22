const N8N_BASE_URL = 'https://n8n.srv1288767.hstgr.cloud/webhook';

export interface PresupuestoData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  localidad: string;
  servicio: string;
  descripcion: string;
  urgente: boolean;
}

export interface CitaData {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  localidad: string;
  fecha: string;
  horario: string;
  servicio: string;
  notas: string;
}

export interface ContactoData {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  id?: string;
}

export async function enviarPresupuesto(data: PresupuestoData): Promise<ApiResponse> {
  const response = await fetch(`${N8N_BASE_URL}/enermax-presupuesto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al enviar la solicitud');
  }

  return response.json();
}

export async function agendarCita(data: CitaData): Promise<ApiResponse> {
  const response = await fetch(`${N8N_BASE_URL}/enermax-cita`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al enviar la solicitud');
  }

  return response.json();
}

export async function enviarContacto(data: ContactoData): Promise<ApiResponse> {
  const response = await fetch(`${N8N_BASE_URL}/enermax-contacto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Error al enviar la solicitud');
  }

  return response.json();
}
