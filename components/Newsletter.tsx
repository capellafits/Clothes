'use client';

import { useState } from 'react';
import Image from 'next/image';

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
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-14 overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto">

        {/* Main Container */}
        <div className="relative pt-0 lg:pt-28">

          {/* Black card background */}
          <div className="bg-linear-to-r from-[#1a1a1a] to-[#2d2d2d] rounded-2xl sm:rounded-3xl lg:rounded-4xl overflow-hidden">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Left Content */}
              <div className="flex flex-col justify-center p-5 sm:p-7 lg:p-12 xl:p-16">
                <div className="space-y-3 sm:space-y-4 lg:space-y-8">

                  {/* Heading */}
                  <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-light text-white mb-0.5 sm:mb-1 leading-tight">
                      Stay Updated
                    </h2>
                    <p className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl text-gray-300 italic font-light">
                      Never miss a Drop
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm lg:text-base text-gray-400 max-w-sm leading-relaxed">
                    Get early access to new releases, restocks, and limited edition Capella drops straight to your inbox
                  </p>

                  {/* Email Subscription Form */}
                  <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 pt-0 sm:pt-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email"
                      className="flex-1 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white text-black placeholder-gray-500 text-xs focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button
                      type="submit"
                      disabled={isSubscribing}
                      className="px-5 sm:px-6 py-2 sm:py-2.5 bg-black border border-black rounded-full text-white text-xs font-medium hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </form>

                  {/* Message */}
                  {message && (
                    <p className={`text-xs sm:text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {message.text}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side */}
              <div className="hidden lg:block h-0"></div>
            </div>
          </div>

          {/* Image breaking out from top */}
          <div className="hidden lg:block absolute right-0 -top-8 sm:-top-12 lg:-top-16 bottom-0 w-full lg:w-1/2 pointer-events-none">
            <div className="relative w-full h-full flex items-end">
              <Image
                src="/Bottle.svg"
                alt="Stay Updated with new trends"
                fill
                className="object-contain object-bottom drop-shadow-2xl"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
