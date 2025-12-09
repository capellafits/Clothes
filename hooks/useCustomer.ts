'use client';

import { useEffect, useState } from 'react';

export function useCustomer() {
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('shopifyCustomer');
    if (stored) {
      setCustomer(JSON.parse(stored));
    }
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    setCustomer(null);
  };

  return { customer, logout };
}