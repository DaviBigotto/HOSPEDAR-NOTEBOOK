'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import CartSidebar from './CartSidebar';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { cartCount, toggleCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="w-full bg-[#050505] border-b border-gold-dark/30 fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center h-24">
            
            {/* Nova Logo (Imagem Enviada) */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden transition-transform group-hover:scale-105">
                   <Image 
                     src="/logo-nova.png" 
                     alt="Bigot Parfums Logo" 
                     fill 
                     className="object-contain" 
                   />
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-8 items-center">
              <Link href="/importados" className="text-gray-200 hover:text-gold transition-colors text-sm uppercase tracking-widest font-medium drop-shadow-md">
                Importados
              </Link>
              <Link href="/testers" className="text-gray-200 hover:text-gold transition-colors text-sm uppercase tracking-widest font-medium drop-shadow-md">
                Testers
              </Link>
              <Link href="/victoria-secret" className="text-gray-200 hover:text-gold transition-colors text-sm uppercase tracking-widest font-medium drop-shadow-md">
                Victoria's Secret
              </Link>
              <Link href="/cremes" className="text-gray-200 hover:text-gold transition-colors text-sm uppercase tracking-widest font-medium drop-shadow-md">
                Cremes
              </Link>

              <SearchBar />

              {/* Cart Button */}
              <button 
                onClick={toggleCart}
                className="ml-4 relative text-gray-200 hover:text-gold transition-colors flex items-center justify-center p-2"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-gold-dark text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden flex items-center">
              <SearchBar isMobile={true} />
              
              <button 
                onClick={toggleCart}
                className="relative text-gray-200 hover:text-gold transition-colors flex items-center justify-center p-2 mr-1"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-gold-dark text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-200 hover:text-gold transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#050505] border-t border-stone-800/50 px-4 pt-2 pb-6 flex flex-col space-y-1 shadow-2xl absolute w-full left-0 top-full">
            <Link href="/importados" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 hover:text-gold transition-colors text-sm uppercase tracking-widest font-medium py-4 border-b border-stone-800/60 block">
              Importados
            </Link>
            <Link href="/testers" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 hover:text-gold transition-colors text-sm uppercase tracking-widest font-medium py-4 border-b border-stone-800/60 block">
              Testers
            </Link>
            <Link href="/victoria-secret" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 hover:text-gold transition-colors text-sm uppercase tracking-widest font-medium py-4 border-b border-stone-800/60 block">
              Victoria's Secret
            </Link>
            <Link href="/cremes" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-200 hover:text-gold transition-colors text-sm uppercase tracking-widest font-medium py-4 block">
              Cremes
            </Link>
          </div>
        )}
      </nav>
      <CartSidebar />
    </>
  );
}
