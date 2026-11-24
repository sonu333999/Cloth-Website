import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';

export const Newsletter: React.FC = () => {
  const { subscribeNewsletter } = useLookbook();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setMessage('');

    try {
      await subscribeNewsletter(trimmed);
      setStatus('success');
      setMessage('Welcome to the Maison Lumière dispatch. Seasonal invitations will arrive soon.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Unable to register your subscription right now. Please try again.');
    }
  };

  return (
    <section
      id="newsletter"
      className="relative z-10 bg-[#30312E] text-white py-20 sm:py-28 px-5 sm:px-8 lg:px-12"
    >
      <div className="max-w-[920px] mx-auto text-center space-y-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#80A997]">
          Private Dispatch
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white">
          LET STYLE FIND YOU.
        </h2>
        <p className="text-[15px] text-[#F4F0E9]/75 max-w-md mx-auto leading-relaxed">
          Discover new collections, stories, and exclusive releases.
        </p>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          noValidate
          className="max-w-lg mx-auto pt-4"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3.5 bg-[#414642] border border-[#99958D]/40 text-sm text-white placeholder:text-[#EAE4DA]/50 focus:outline-none focus:border-[#80A997] transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="px-7 py-3.5 bg-[#EAE4DA] text-[#30312E] text-xs font-mono uppercase tracking-[0.18em] font-medium hover:bg-[#80A997] hover:text-white transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-60 whitespace-nowrap shrink-0"
            >
              <span>{status === 'submitting' ? 'Joining...' : 'Subscribe'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {status === 'error' && (
            <p role="alert" className="mt-3 text-xs text-rose-300 font-mono">
              {message}
            </p>
          )}

          {status === 'success' && (
            <p
              role="status"
              className="mt-4 inline-flex items-center gap-2 text-xs text-[#80A997] font-mono"
            >
              <Check className="w-4 h-4" />
              <span>{message}</span>
            </p>
          )}
        </form>
      </div>
    </section>
  );
};
