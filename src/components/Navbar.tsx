import React, { useEffect, useState } from 'react';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User as UserIcon,
  Shield,
  LogOut,
} from 'lucide-react';
import { useLookbook } from '../context/LookbookContext';

export const Navbar: React.FC = () => {
  const {
    brand,
    user,
    isAdmin,
    cart,
    wishlist,
    activePage,
    setActivePage,
    setSelectedCollection,
    setIsBagOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    signInWithGoogle,
    signOutUser,
  } = useLookbook();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const totalBagCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navigateToSection = (sectionId: string) => {
    setMobileOpen(false);
    setSelectedCollection(null);
    if (activePage !== 'home') {
      setActivePage('home');
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToPage = (page: 'home' | 'shop' | 'about' | 'journal' | 'admin') => {
    setMobileOpen(false);
    setSelectedCollection(null);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || activePage !== 'home'
          ? 'bg-[#EAE4DA]/92 backdrop-blur-md border-b border-[#D2CCC1]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => navigateToPage('home')}
          className="font-serif text-lg sm:text-xl tracking-[0.22em] font-semibold text-[#30312E] uppercase whitespace-nowrap shrink-0 hover:opacity-75 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#30312E]"
        >
          {brand.brandName}
        </button>

        {/* Zone 2: Center Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 lg:gap-10 text-[13px] tracking-[0.12em] uppercase text-[#30312E]/85"
        >
          <button
            type="button"
            onClick={() => navigateToSection('featured-collections')}
            className="whitespace-nowrap shrink-0 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#30312E] hover:after:w-full after:transition-all after:duration-200 hover:text-[#30312E]"
          >
            Collections
          </button>
          <button
            type="button"
            onClick={() => navigateToPage('home')}
            className={`whitespace-nowrap shrink-0 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[#30312E] after:transition-all after:duration-200 hover:text-[#30312E] ${
              activePage === 'home' ? 'after:w-full text-[#30312E] font-medium' : 'after:w-0 hover:after:w-full'
            }`}
          >
            Lookbook
          </button>
          <button
            type="button"
            onClick={() => navigateToPage('about')}
            className={`whitespace-nowrap shrink-0 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[#30312E] after:transition-all after:duration-200 hover:text-[#30312E] ${
              activePage === 'about' ? 'after:w-full text-[#30312E] font-medium' : 'after:w-0 hover:after:w-full'
            }`}
          >
            About
          </button>
          <button
            type="button"
            onClick={() => navigateToSection('collection-stories')}
            className="whitespace-nowrap shrink-0 py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#30312E] hover:after:w-full after:transition-all after:duration-200 hover:text-[#30312E]"
          >
            Journal
          </button>
          <button
            type="button"
            onClick={() => navigateToPage('shop')}
            className={`whitespace-nowrap shrink-0 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[#30312E] after:transition-all after:duration-200 hover:text-[#30312E] ${
              activePage === 'shop' ? 'after:w-full text-[#30312E] font-medium' : 'after:w-0 hover:after:w-full'
            }`}
          >
            Shop
          </button>
        </nav>

        {/* Zone 3: Functional Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search collections and pieces"
            className="w-10 h-10 flex items-center justify-center text-[#30312E] hover:bg-[#30312E]/5 transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-[#30312E]"
          >
            <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={() => setIsWishlistOpen(true)}
            aria-label={`Open wishlist (${wishlist.length} saved)`}
            className="relative w-10 h-10 flex items-center justify-center text-[#30312E] hover:bg-[#30312E]/5 transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-[#30312E]"
          >
            <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
            {wishlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-[#80A997] text-white font-mono text-[10px] leading-4 text-center rounded-full tabular-nums">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsBagOpen(true)}
            aria-label={`Open shopping bag (${totalBagCount} items)`}
            className="relative w-10 h-10 flex items-center justify-center text-[#30312E] hover:bg-[#30312E]/5 transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-[#30312E]"
          >
            <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
            {totalBagCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-[#30312E] text-white font-mono text-[10px] leading-4 text-center rounded-full tabular-nums">
                {totalBagCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => navigateToPage('admin')}
              aria-label="Atelier Admin Dashboard"
              title="Atelier Admin"
              className={`hidden sm:flex w-10 h-10 items-center justify-center transition-colors rounded-sm ${
                activePage === 'admin'
                  ? 'bg-[#30312E] text-white'
                  : 'text-[#30312E] hover:bg-[#30312E]/5'
              }`}
            >
              <Shield className="w-[17px] h-[17px]" strokeWidth={1.5} />
            </button>
          )}

          {user ? (
            <button
              type="button"
              onClick={() => void signOutUser()}
              title={`Signed in as ${user.email} — Click to sign out`}
              aria-label="Sign out"
              className="hidden sm:flex w-10 h-10 items-center justify-center text-[#30312E] hover:bg-[#30312E]/5 transition-colors rounded-sm"
            >
              <LogOut className="w-[17px] h-[17px]" strokeWidth={1.5} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              title="Sign in with Google"
              aria-label="Sign in with Google"
              className="hidden sm:flex w-10 h-10 items-center justify-center text-[#30312E] hover:bg-[#30312E]/5 transition-colors rounded-sm"
            >
              <UserIcon className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden w-11 h-11 flex items-center justify-center text-[#30312E] hover:bg-[#30312E]/5 rounded-sm"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#F4F0E9] border-b border-[#D2CCC1] px-6 py-6 space-y-3">
          <button
            type="button"
            onClick={() => navigateToSection('featured-collections')}
            className="block w-full text-left py-2.5 text-sm uppercase tracking-[0.16em] text-[#30312E] border-b border-[#D2CCC1]/60"
          >
            Collections
          </button>
          <button
            type="button"
            onClick={() => navigateToPage('home')}
            className="block w-full text-left py-2.5 text-sm uppercase tracking-[0.16em] text-[#30312E] border-b border-[#D2CCC1]/60"
          >
            Lookbook
          </button>
          <button
            type="button"
            onClick={() => navigateToPage('about')}
            className="block w-full text-left py-2.5 text-sm uppercase tracking-[0.16em] text-[#30312E] border-b border-[#D2CCC1]/60"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => navigateToSection('collection-stories')}
            className="block w-full text-left py-2.5 text-sm uppercase tracking-[0.16em] text-[#30312E] border-b border-[#D2CCC1]/60"
          >
            Journal
          </button>
          <button
            type="button"
            onClick={() => navigateToPage('shop')}
            className="block w-full text-left py-2.5 text-sm uppercase tracking-[0.16em] text-[#30312E] border-b border-[#D2CCC1]/60"
          >
            Shop All Looks
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigateToPage('admin')}
              className="block w-full text-left py-2.5 text-sm uppercase tracking-[0.16em] text-[#30312E] border-b border-[#D2CCC1]/60"
            >
              Atelier Admin
            </button>
          )}
          <div className="pt-2 flex items-center justify-between">
            {user ? (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  void signOutUser();
                }}
                className="text-xs font-mono uppercase tracking-[0.14em] text-[#30312E]/80 underline"
              >
                Sign out ({user.email})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  void signInWithGoogle();
                }}
                className="px-4 py-2.5 bg-[#30312E] text-white text-xs font-mono uppercase tracking-[0.14em]"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
