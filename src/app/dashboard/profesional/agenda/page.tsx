'use client';

import { useState, useEffect } from 'react';
import { Clock, Save, Loader2, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase, Disponibilidad } from '@/lib/supabase';

const DIAS_SEMANA = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miercoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sabado' },
  { value: 0, label: 'Domingo' },
];

const HORARIOS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00'
];

interface HorarioForm {
  id?: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
}

export default function AgendaPage() {
  const { usuario } = useAuth();
  const [horarios, setHorarios] = useState<HorarioForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (usuario?.profesional_id) {
      fetchDisponibilidad();
    }
  }, [usuario]);

  const fetchDisponibilidad = async () => {
    if (!usuario?.profesional_id) return;

    const { data } = await supabase
      .from('disponibilidad')
      .select('*')
      .eq('profesional_id', usuario.profesional_id)
      .order('dia_semana');

    if (data && data.length > 0) {
      setHorarios(data.map(d => ({
        id: d.id,
        dia_semana: d.dia_semana,
        hora_inicio: d.hora_inicio,
        hora_fin: d.hora_fin,
        activo: d.activo
      })));
    } else {
      // Horarios por defecto: Lunes a Viernes 9-18
      setHorarios([
        { dia_semana: 1, hora_inicio: '09:00', hora_fin: '18:00', activo: true },
        { dia_semana: 2, hora_inicio: '09:00', hora_fin: '18:00', activo: true },
        { dia_semana: 3, hora_inicio: '09:00', hora_fin: '18:00', activo: true },
        { dia_semana: 4, hora_inicio: '09:00', hora_fin: '18:00', activo: true },
        { dia_semana: 5, hora_inicio: '09:00', hora_fin: '18:00', activo: true },
      ]);
    }
    setLoading(false);
  };

  const addHorario = () => {
    // Find first day not already added
    const usedDays = horarios.map(h => h.dia_semana);
    const availableDay = DIAS_SEMANA.find(d => !usedDays.includes(d.value));

    if (availableDay) {
      setHorarios([...horarios, {
        dia_semana: availableDay.value,
        hora_inicio: '09:00',
        hora_fin: '18:00',
        activo: true
      }]);
    }
  };

  const removeHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const updateHorario = (index: number, field: keyof HorarioForm, value: string | number | boolean) => {
    const updated = [...horarios];
    updated[index] = { ...updated[index], [field]: value };
    setHorarios(updated);
  };

  const handleSave = async () => {
    if (!usuario?.profesional_id) return;

    setSaving(true);
    setSaved(false);

    // Delete existing
    await supabase
      .from('disponibilidad')
      .delete()
      .eq('profesional_id', usuario.profesional_id);

    // Insert new
    const inserts = horarios.map(h => ({
      profesional_id: usuario.profesional_id,
      dia_semana: h.dia_semana,
      hora_inicio: h.hora_inicio,
      hora_fin: h.hora_fin,
      activo: h.activo
    }));

    await supabase.from('disponibilidad').insert(inserts);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getDiaLabel = (dia: number) => {
    return DIAS_SEMANA.find(d => d.value === dia)?.label || '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary-500" />
              Mi Disponibilidad
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Configura los dias y horarios en los que estas disponible para trabajar
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-secondary-900 font-semibold px-4 py-2 rounded-lg"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : saved ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Guardado!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar
              </>
            )}
          </button>
        </div>

        <div className="space-y-4">
          {horarios.map((horario, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-xl border ${
                horario.activo ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
              }`}
            >
              {/* Toggle activo */}
              <button
                onClick={() => updateHorario(index, 'activo', !horario.activo)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  horario.activo ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                    horario.activo ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>

              {/* Dia */}
              <select
                value={horario.dia_semana}
                onChange={(e) => updateHorario(index, 'dia_semana', parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white font-medium"
              >
                {DIAS_SEMANA.map((dia) => (
                  <option key={dia.value} value={dia.value}>
                    {dia.label}
                  </option>
                ))}
              </select>

              {/* Hora inicio */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">de</span>
                <select
                  value={horario.hora_inicio}
                  onChange={(e) => updateHorario(index, 'hora_inicio', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  {HORARIOS.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hora fin */}
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">a</span>
                <select
                  value={horario.hora_fin}
                  onChange={(e) => updateHorario(index, 'hora_fin', e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  {HORARIOS.map((hora) => (
                    <option key={hora} value={hora}>
                      {hora}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delete */}
              <button
                onClick={() => removeHorario(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg ml-auto"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          {/* Add button */}
          {horarios.length < 7 && (
            <button
              onClick={addHorario}
              className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar dia
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Vista previa</h2>
        <div className="grid grid-cols-7 gap-2">
          {DIAS_SEMANA.map((dia) => {
            const horario = horarios.find(h => h.dia_semana === dia.value && h.activo);
            return (
              <div
                key={dia.value}
                className={`p-3 rounded-lg text-center ${
                  horario ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <p className={`font-medium text-sm ${horario ? 'text-green-700' : 'text-gray-400'}`}>
                  {dia.label.slice(0, 3)}
                </p>
                {horario ? (
                  <p className="text-xs text-green-600 mt-1">
                    {horario.hora_inicio}-{horario.hora_fin}
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-1">No disponible</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
