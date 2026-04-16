'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();

  // Helper to capitalize words professionally
  const formatTitle = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/Nyc/g, 'NYC')
      .replace(/Vip/g, 'VIP')
      .replace(/Usb/g, 'USB')
      .replace(/Edt/g, 'EDT')
      .replace(/Edp/g, 'EDP');
  };

  // Helper to split name into Parts
  const parseProductName = (fullName: string, manualVolume: string | null) => {
    const volumeRegex = /(\d+\s?ml|\d+\s?g|\d+\s?oz)/i;
    const nameWithoutVolume = fullName.replace(volumeRegex, '').trim();
    const extractedVolume = (fullName.match(volumeRegex) || [])[0] || '';

    return {
      mainName: formatTitle(nameWithoutVolume),
      volume: (manualVolume || extractedVolume).toUpperCase()
    };
  };

  const { mainName, volume } = parseProductName(product.nome, product.volumetria);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      nome: product.nome,
      preco: product.preco_venda,
      imagem: product.imagem_url || '',
      categoria: product.categoria,
      estoque: product.estoque
    });
  };

  return (
    <div className="group relative bg-white p-2.5 md:p-3.5 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100/50 hover:shadow-2xl hover:border-[#d4af37]/30 transition-all duration-700 text-left flex flex-col h-full overflow-hidden">
      <Link href={`/produto/${product.id}`} className="flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-500">
        {/* Image Container - Maximized Area */}
        <div className="relative aspect-[4/5] bg-[#fafafa] rounded-sm overflow-hidden mb-1.5 flex items-center justify-center">
          {product.imagem_url ? (
             <div className="relative w-full h-full p-0.5">
               <Image 
                 src={product.imagem_url} 
                 alt={product.nome} 
                 fill
                 sizes="(max-width: 768px) 50vw, 25vw"
                 className="object-contain mix-blend-darken scale-110 group-hover:scale-125 transition-transform duration-[2000ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
                 priority={false}
               />
             </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-stone-200 font-sans">Sem Imagem</div>
          )}
          
          {/* Badges Refined */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
            {product.is_promocao && (
              <span className="bg-stone-800 text-[#d4af37] text-[7px] px-2 py-0.5 rounded-full tracking-[0.15em] uppercase font-bold shadow-sm opacity-90 font-sans">Oferta</span>
            )}
            {product.estoque > 0 && product.estoque <= 3 && (
              <span className="bg-rose-900/80 text-white text-[7px] px-2 py-0.5 rounded-full tracking-[0.15em] uppercase font-bold shadow-sm opacity-90 font-sans">Últimos unidades</span>
            )}
          </div>
        </div>
        
        {/* Content Area - Tightened Spacing */}
        <div className="flex flex-col flex-grow font-sans">
          <div className="flex flex-col justify-start mb-2">
            <h3 className="text-[15px] md:text-[16px] font-bold text-stone-900 leading-tight group-hover:text-[#d4af37] transition-colors duration-500 tracking-tight flex items-baseline flex-wrap gap-x-1.5">
              <span>{mainName}</span>
              {volume && (
                <span className="text-[11px] md:text-[12px] font-black text-[#b89142] tracking-widest opacity-90">
                   • {volume}
                </span>
              )}
            </h3>
          </div>

          <div className="mt-auto pt-1.5 border-t border-stone-100/40 flex flex-col gap-0">
             {/* Pix Price & Label - Elegant Side by Side */}
             <div className="flex items-baseline gap-1.5">
               <span className="text-[18px] md:text-[20px] font-black text-[#b89142] tracking-tighter">
                 R$ {product.preco_venda.toFixed(2).replace('.', ',')}
               </span>
               <span className="text-[9px] text-stone-400 font-medium lowercase">no Pix</span>
             </div>

             {/* Secondary Pricing Wrapper */}
             <div className="flex flex-col -mt-0.5">
               <p className="text-[10px] md:text-[11px] font-bold text-stone-800 tracking-tight">
                 ou R$ {(product.preco_venda / 0.95).toFixed(2).replace('.', ',')}
               </p>
               <p className="text-[9px] text-stone-400 font-medium uppercase tracking-widest opacity-70">
                 12x de R$ {(product.preco_venda / 0.95 / 12).toFixed(2).replace('.', ',')} s/ juros
               </p>
             </div>
             
             {/* Old Price - Minimalist */}
             <p className="text-[9px] text-stone-200 line-through font-light tracking-wide italic mt-0.5">
               R$ {(product.preco_venda / 0.95 / 0.90).toFixed(2).replace('.', ',')}
             </p>
          </div>
        </div>
      </Link>

      {/* Action Button - Touch Optimized */}
      <button 
        onClick={handleAddToCart}
        className="w-full h-11 bg-[#050505] text-[#d4af37] flex items-center justify-center rounded-sm text-[10px] font-bold uppercase tracking-[0.15em] transform active:scale-95 transition-all duration-300 hover:bg-[#d4af37] hover:text-black mt-2 shadow-lg"
      >
        COMPRAR AGORA
      </button>
      
      {/* Visual Depth Accent */}
      <div className="absolute bottom-0 left-0 h-[1.5px] bg-[#d4af37] w-0 group-hover:w-full transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
    </div>
  );
}
