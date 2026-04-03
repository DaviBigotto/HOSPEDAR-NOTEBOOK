'use client';

import { Sparkles, Wind, Clock, Calendar, Bookmark } from 'lucide-react';
import { fragranceData, FragranceInfo } from '@/data/fragranceData';

interface FragranceDetailsProps {
  productName: string;
}

export default function FragranceDetails({ productName }: FragranceDetailsProps) {
  // Find perfume in data by name (partial match if needed)
  const findFragrance = () => {
    const nameLower = productName.toLowerCase();
    
    // Exact match
    if (fragranceData[productName]) return fragranceData[productName];
    
    // Partial Match (looking for substrings)
    for (const key in fragranceData) {
      if (nameLower.includes(key.toLowerCase()) || key.toLowerCase().includes(nameLower)) {
        return fragranceData[key];
      }
    }
    
    return null;
  };

  const info = findFragrance();

  if (!info) {
    return (
      <div className="mt-12 p-8 bg-stone-50 border border-stone-100 rounded-sm">
        <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Bookmark className="w-3 h-3" />
          Pirâmide Olfativa
        </span>
        <p className="text-sm font-serif italic text-stone-600 leading-relaxed">
          Notas de saída, corpo e fundo harmoniosamente combinadas para uma assinatura única.
          Nossos especialistas podem fornecer a pirâmide olfativa completa desta fragrância.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16 space-y-16 animate-in fade-in duration-1000">
      {/* 1. Olfactory Pyramid Area */}
      <div className="space-y-10">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-900 border-l-2 border-[#d4af37] pl-4">
          Pirâmide Olfativa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Top Notes */}
          <div className="bg-white p-6 border border-stone-100 rounded-sm hover:shadow-lg transition-shadow duration-500 group">
            <span className="block text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-4 opacity-70 group-hover:opacity-100 transition-opacity">Notas de Topo</span>
            <p className="text-sm font-medium text-stone-800 leading-relaxed">
              {info.topNotes.join(' • ')}
            </p>
          </div>

          {/* Heart Notes */}
          <div className="bg-white p-6 border border-stone-100 rounded-sm hover:shadow-lg transition-shadow duration-500 group">
            <span className="block text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-4 opacity-70 group-hover:opacity-100 transition-opacity">Notas de Coração</span>
            <p className="text-sm font-medium text-stone-800 leading-relaxed">
              {info.heartNotes.join(' • ')}
            </p>
          </div>

          {/* Base Notes */}
          <div className="bg-white p-6 border border-stone-100 rounded-sm hover:shadow-lg transition-shadow duration-500 group">
            <span className="block text-[9px] font-bold text-[#d4af37] uppercase tracking-widest mb-4 opacity-70 group-hover:opacity-100 transition-opacity">Notas de Base</span>
            <p className="text-sm font-medium text-stone-800 leading-relaxed">
              {info.baseNotes.join(' • ')}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Technical Performance Grid */}
      <div className="space-y-10">
        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-900 border-l-2 border-[#d4af37] pl-4">
          Características & Performance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
          {/* Family */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100">
              <Sparkles className="w-5 h-5 text-[#d4af37]" strokeWidth={1} />
            </div>
            <div>
              <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Família Olfativa</span>
              <span className="text-[15px] font-medium text-stone-800">{info.family}</span>
            </div>
          </div>

          {/* Fixation */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100">
              <Clock className="w-5 h-5 text-[#d4af37]" strokeWidth={1} />
            </div>
            <div>
              <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Fixação</span>
              <span className="text-[15px] font-medium text-stone-800">{info.fixation}</span>
            </div>
          </div>

          {/* Projection */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100">
              <Wind className="w-5 h-5 text-[#d4af37]" strokeWidth={1} />
            </div>
            <div>
              <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Projeção</span>
              <span className="text-[15px] font-medium text-stone-800">{info.projection}</span>
            </div>
          </div>

          {/* Occasion */}
          <div className="flex gap-5">
            <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center shrink-0 border border-stone-100">
              <Calendar className="w-5 h-5 text-[#d4af37]" strokeWidth={1} />
            </div>
            <div>
              <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Melhor Ocasião</span>
              <span className="text-[15px] font-medium text-stone-800">{info.occasion}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Brand Message */}
      <div className="pt-8 border-t border-stone-100">
        <p className="text-[10px] text-stone-400 text-center uppercase tracking-[0.4em] font-medium opacity-50">
          Bigot Parfums • Curadoria de Luxo
        </p>
      </div>
    </div>
  );
}
