'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: "You're on the list! We'll notify you when it drops." });
        setEmail('');
        setTimeout(() => setMessage(null), 4000);
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-xl">
        <h2 className="text-sm font-bold uppercase text-black">
          Join the Capella orbit and get 15% off
        </h2>

        <p className="mt-1 text-xs sm:text-sm font-normal text-black">
          Stay updated on the latest releases and get access to exclusive deals!
        </p>

        {/* Square input butted against a solid black submit, per the reference */}
        <form onSubmit={handleSubscribe} className="mt-4 flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER YOUR EMAIL"
            className="h-[45px] flex-1 min-w-0 border border-black border-r-0 bg-transparent px-4 text-xs text-black placeholder-black/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSubscribing}
            className="h-[45px] shrink-0 bg-black px-4 text-[10px] uppercase tracking-wide text-white transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubscribing ? '...' : 'Submit'}
          </button>
        </form>

        {message && (
          <p className={`mt-2 text-xs ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </div>
    </section>
  );
}
