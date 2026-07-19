'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

/**
 * Client-side equivalent of Nuxt's `middleware: 'auth'`. Waits for the
 * localStorage token to be checked (`hydrated`) before deciding whether to
 * redirect, so it can't race the rehydration effect in <Providers>.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { loggedIn, hydrated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (hydrated && !loggedIn) {
      router.replace('/login');
    }
  }, [hydrated, loggedIn, router]);

  if (!hydrated || !loggedIn) {
    return <div className="h-screen" />;
  }

  return <>{children}</>;
}
