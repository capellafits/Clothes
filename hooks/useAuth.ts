'use client';

import { useEffect, useState } from 'react';

export interface ShopifyCustomer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export function useAuth() {
  const [user, setUser] = useState<ShopifyCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in customer from Shopify via API
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();
        setUser(data || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, []);

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    setUser(null);
    window.location.href = '/';
  };

  return {
    user,
    loading,
    isLoggedIn: !!user,
    logout,
  };
}