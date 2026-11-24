import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LookbookProvider, useLookbook } from './context/LookbookContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CollectionDetails } from './components/CollectionDetails';
import { ShopDrawer } from './components/ShopDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { LegalModal } from './components/LegalModal';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { AboutPage } from './pages/AboutPage';
import { Admin } from './pages/Admin';

const AppShell: React.FC = () => {
  const { activePage, toast } = useLookbook();

  return (
    <div className="min-h-screen flex flex-col bg-[#EAE4DA] text-[#30312E] selection:bg-[#80A997] selection:text-white">
      <Navbar />

      <div className="flex-1">
        {activePage === 'home' && <Home />}
        {activePage === 'shop' && <Shop />}
        {activePage === 'about' && <AboutPage />}
        {activePage === 'journal' && <Home />}
        {activePage === 'admin' && <Admin />}
      </div>

      <Footer />

      <CollectionDetails />
      <ShopDrawer />
      <WishlistDrawer />
      <SearchModal />
      <LegalModal />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-[#30312E] text-white font-mono text-xs tracking-wide shadow-2xl border border-[#414642] whitespace-nowrap"
        >
          {toast}
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <LookbookProvider>
        <AppShell />
      </LookbookProvider>
    </ErrorBoundary>
  );
}
