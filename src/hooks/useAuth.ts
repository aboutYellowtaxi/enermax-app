'use client';

import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Usuario } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  usuario: Usuario | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    usuario: null,
    session: null,
    loading: true,
  });

  // Cargar usuario de la tabla usuarios
  const loadUsuario = useCallback(async (authId: string) => {
    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_id', authId)
      .single();
    return data as Usuario | null;
  }, []);

  useEffect(() => {
    // Obtener sesion actual
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let usuario = null;
      if (session?.user) {
        usuario = await loadUsuario(session.user.id);
      }
      setState({
        user: session?.user ?? null,
        usuario,
        session,
        loading: false,
      });
    });

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        let usuario = null;
        if (session?.user) {
          usuario = await loadUsuario(session.user.id);
        }
        setState({
          user: session?.user ?? null,
          usuario,
          session,
          loading: false,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, [loadUsuario]);

  // Login con email
  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  // Login con telefono (enviar OTP)
  const signInWithPhone = async (phone: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone,
    });
    return { data, error };
  };

  // Verificar OTP de telefono
  const verifyOtp = async (phone: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    return { data, error };
  };

  // Registro con email
  const signUpWithEmail = async (
    email: string,
    password: string,
    userData: { nombre: string; telefono?: string; tipo: 'cliente' | 'profesional' }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error || !data.user) {
      return { data, error };
    }

    // Crear registro en tabla usuarios
    const { error: userError } = await supabase.from('usuarios').insert({
      auth_id: data.user.id,
      tipo: userData.tipo,
      nombre: userData.nombre,
      telefono: userData.telefono,
      email: email,
    });

    if (userError) {
      return { data, error: userError };
    }

    return { data, error: null };
  };

  // Logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user: state.user,
    usuario: state.usuario,
    session: state.session,
    loading: state.loading,
    isAuthenticated: !!state.user,
    isProfesional: state.usuario?.tipo === 'profesional',
    isCliente: state.usuario?.tipo === 'cliente',
    signInWithEmail,
    signInWithPhone,
    verifyOtp,
    signUpWithEmail,
    signOut,
  };
}
