'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar({ isMobile = false }) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
      if (isMobile) setIsExpanded(false);
      setQuery('');
    }
  };

  if (isMobile) {
    return (
      <div className="relative flex items-center mr-2">
        {isExpanded ? (
          <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center w-48 bg-[#111] border border-gold-dark/50 rounded-full px-3 py-1 z-50 transition-all duration-300">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="bg-transparent text-gray-200 text-sm outline-none w-full placeholder-gray-500 font-light"
              autoFocus
            />
            <button type="submit" className="text-gold-dark hover:text-gold ml-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button type="button" onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-200 ml-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </form>
        ) : (
          <button onClick={() => setIsExpanded(true)} className="text-gray-200 hover:text-gold transition-colors p-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSearch} className="ml-6 flex items-center bg-[#111] border border-stone-800 rounded-full px-3 py-1.5 focus-within:border-gold-dark/70 transition-colors w-40 lg:w-48 group">
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
        className="bg-transparent text-gray-200 text-sm outline-none w-full placeholder-gray-600 font-light"
      />
      <button type="submit" className="text-gray-500 group-hover:text-gold transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </button>
    </form>
  );
}
