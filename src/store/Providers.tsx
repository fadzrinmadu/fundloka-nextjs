'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { fetchCurrentUser, hydrateFromStorage, logout } from './authSlice';
import { TOKEN_STORAGE_KEY } from '@/lib/api';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    store.dispatch(hydrateFromStorage(token));

    if (!token) return;

    store.dispatch(fetchCurrentUser()).unwrap().catch(() => {
      // Stored token is no longer valid server-side; drop the stale session.
      store.dispatch(logout());
    });
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  );
}
