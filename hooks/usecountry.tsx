'use client';

// Hook that always returns 'CA' (Canada/global store)
export function useCountry() {
  return 'CA';
}

// If you still need a query param helper for some reason
export function useCountryParam() {
  const country = useCountry();
  return `?country=${country}`;
}


