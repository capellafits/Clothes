'use client';

import { useEffect, useState } from 'react';

export function useCustomer() {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });
        const data = await res.json();
        setCustomer(data.customer);
      } catch {
        setCustomer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setCustomer(null);
  };

  return { customer, loading, logout };
}