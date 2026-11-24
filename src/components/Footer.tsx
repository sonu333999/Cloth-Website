import React from 'react';
import { useLookbook } from '../context/LookbookContext';

export const Footer: React.FC = () => {
  const { brand, isAdmin, setActivePage, setLegalModal, setSelectedCollection } =
    useLookbook();

  const jumpHomeSection = (id: string) => {
    setSelectedCollection(null);
    setActivePage('home');
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="relative z-10 bg-[#EAE4DA] border-t border-[#D2CCC1] pt-16 pb-12 px-5 sm:px-8 lg:px-12 text-[#30312E]">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-14 border-b border-[#D2CCC1]">
          <div className="md:col-span-5 space-y-4">
            <p className="font-serif text-2xl tracking-[0.22em] uppercase font-semibold">
              {brand.brandName}
            </p>
            <p className="text-sm text-[#30312E]/70 max-w-sm leading-relaxed">
              {brand.tagline}
            </p>
            <p className="font-mono text-xs text-[#99958D]">
              atelier@maisonlumiere.example · +33 1 42 68 55 00
            </p>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#99958D]">
              House
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#80A997] transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => jumpHomeSection('featured-collections')}
                  className="hover:text-[#80A997] transition-colors"
                >
                  Collections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => jumpHomeSection('newsletter')}
                  className="hover:text-[#80A997] transition-colors"
                >
                  Newsletter
                </button>
              </li>
              <li>
                <a
                  href="mailto:atelier@maisonlumiere.example"
                  className="hover:text-[#80A997] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#99958D]">
              Social
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#80A997] transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#80A997] transition-colors"
                >
                  Pinterest
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#99958D]">
              Legal &amp; Atelier
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('privacy')}
                  className="hover:text-[#80A997] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegalModal('terms')}
                  className="hover:text-[#80A997] transition-colors"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="font-mono text-xs uppercase tracking-[0.14em] text-[#30312E]/75 hover:text-[#30312E] pt-1"
                >
                  {isAdmin ? 'Open Admin Showroom →' : 'Atelier Admin Sign In →'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#99958D] font-mono">
          <p>© {new Date().getFullYear()} {brand.brandName}. All rights reserved.</p>
          <p>Paris · Milan · New Delhi</p>
        </div>
      </div>
    </footer>
  );
};
