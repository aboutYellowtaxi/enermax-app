'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { usuario, loading, isProfesional } = useAuth();

  useEffect(() => {
    if (!loading && usuario) {
      if (isProfesional) {
        router.replace('/dashboard/profesional');
      } else {
        router.replace('/dashboard/cliente');
      }
    }
  }, [usuario, loading, isProfesional, router]);

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-4" />
        <p className="text-gray-500">Redirigiendo...</p>
      </div>
    </div>
  );
}
