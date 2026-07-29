// app/products/[handle]/error.tsx
'use client';

export default function ProductError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#f5f3ef] flex flex-col items-center justify-center px-6 text-center">
      <p
        className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3"
        style={{ fontFamily: 'League Spartan, sans-serif' }}
      >
        Capella
      </p>
      <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
        This page took too long to load
      </h1>
      <p className="text-sm text-gray-600 mb-8 max-w-sm">
        Just a hiccup on our end, your connection is fine. Tap below and it
        should come right up.
      </p>
      <button
        onClick={() => reset()}
        className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}
