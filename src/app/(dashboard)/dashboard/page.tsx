'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.role === 'RECRUITER') {
      router.replace('/recruiter/dashboard');
    } else if (user?.role === 'ADMIN') {
      router.replace('/admin');
    } else {
      router.replace('/candidate/dashboard');
    }
  }, [user, router]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
