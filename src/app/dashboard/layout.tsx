'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Calendar, User, LogOut, Loader2, Briefcase, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, usuario, loading, signOut, isProfesional, isCliente } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-4" />
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const basePath = isProfesional ? '/dashboard/profesional' : '/dashboard/cliente';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top navbar */}
      <nav className="bg-secondary-900 text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary-500">Enermax</span>
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                {isProfesional ? (
                  <Briefcase className="w-4 h-4 text-primary-400" />
                ) : (
                  <Users className="w-4 h-4 text-primary-400" />
                )}
                <span className="text-secondary-300">{usuario?.nombre || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-secondary-800 rounded-lg transition-colors"
                title="Cerrar sesion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb / nav tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Link
            href={basePath}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-gray-700 font-medium whitespace-nowrap"
          >
            <Home className="w-4 h-4" />
            Inicio
          </Link>
          {isProfesional ? (
            <>
              <Link
                href={`${basePath}/agenda`}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-gray-700 font-medium whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                Mi Agenda
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`${basePath}/citas`}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-gray-700 font-medium whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                Mis Citas
              </Link>
              <Link
                href="/profesionales"
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg text-gray-700 font-medium whitespace-nowrap"
              >
                <User className="w-4 h-4" />
                Buscar profesional
              </Link>
            </>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
