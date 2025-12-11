// hooks/useCustomer.ts
'use client';

import { useEffect, useState } from 'react';

type Country = 'IN' | 'CA';

function detectCountry(): Country {
  if (typeof window === 'undefined') return 'CA';

  const params = new URLSearchParams(window.location.search);
  const urlCountry = params.get('country');
  if (urlCountry === 'IN' || urlCountry === 'CA') return urlCountry;

  const host = window.location.hostname.toLowerCase();
  if (host.startsWith('in.')) return 'IN';

  return 'CA';
}

export function useCustomer() {
  const [customer, setCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [country] = useState<Country>(detectCountry);

  const fetchCustomer = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'x-country': country,
        },
      });

      const data = await res.json();
      setCustomer(data.customer ?? null);
    } catch (e) {
      console.error('Failed to load customer', e);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [country]);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setCustomer(null);
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return { customer, loading, country, reload: fetchCustomer, logout };
}