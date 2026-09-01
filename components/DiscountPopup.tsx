'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function DiscountPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dismissed = localStorage.getItem('capella_popup_dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('capella_popup_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }
      setSubmitted(true);
      localStorage.setItem('capella_popup_dismissed', 'true');
      setTimeout(() => setIsVisible(false), 4000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-md bg-[#FFFFFF] rounded-2xl overflow-hidden shadow-2xl">

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-colors duration-200"
          aria-label="Close"
        >
          <X size={16} className="text-neutral-800" />
        </button>

        <div className="bg-[#1a1a1a] px-8 py-5 text-center">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-gray-400">Exclusive Offer</p>
          <p className="text-4xl font-bold text-white mt-1" style={{ fontFamily: 'League Spartan, sans-serif' }}>
            10% OFF
          </p>
          <p className="text-sm text-gray-300 mt-1">your first order</p>
        </div>

        <div className="px-8 py-7">
          {!submitted ? (
            <>
              <h2
                className="text-2xl font-bold text-neutral-900 mb-1"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                Join the Capella family
              </h2>
              <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                Sign up and we&apos;ll send your discount code straight to your inbox — plus early access to new drops.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                />
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium tracking-widest uppercase hover:bg-neutral-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'League Spartan, sans-serif' }}
                >
                  {isSubmitting ? 'Sending...' : 'Claim My 10% Off'}
                </button>
              </form>

              <button
                onClick={handleClose}
                className="w-full mt-3 text-xs text-neutral-400 hover:text-neutral-600 transition-colors duration-200 text-center"
              >
                No thanks, I&apos;ll pay full price
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Check your inbox!
              </h3>
              <p className="text-sm text-neutral-500">
                Your 10% discount code is on its way to <span className="font-medium text-neutral-700">{email}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
