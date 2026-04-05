'use client';

import Link from 'next/link';
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

  // Helper to split name into Parts: [Brand/Cat, Name, Volume]
  const parseProductName = (fullName: string) => {
    const volumeRegex = /(\d+\s?ml|\d+\s?g|\d+\s?oz)/i;
    const volumeMatch = fullName.match(volumeRegex);
    const volume = volumeMatch ? volumeMatch[0] : '';
    let nameWithoutVolume = fullName.replace(volumeRegex, '').trim();

    return {
      mainName: formatTitle(nameWithoutVolume.split('-')[0].trim()),
    };
  };

  const { mainName } = parseProductName(product.nome);

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
    <div className="group relative bg-white p-6 md:p-7 rounded-sm shadow-sm border border-stone-100 hover:shadow-2xl hover:border-[#d4af37]/30 transition-all duration-700 text-left flex flex-col h-full overflow-hidden">
      <Link href={`/produto/${product.id}`} className="flex flex-col h-full transform hover:-translate-y-1.5 transition-transform duration-500">
        {/* Image Container */}
        <div className="relative aspect-[4/5] bg-[#fafafa] rounded-sm overflow-hidden mb-6 flex items-center justify-center">
          {product.imagem_url ? (
             <img src={product.imagem_url} alt={product.nome} className="object-contain w-full h-full p-6 mix-blend-darken scale-100 group-hover:scale-105 transition-transform duration-[1500ms] ease-out" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-stone-200 font-sans">Sem Imagem</div>
          )}
          
          {/* Badges Premium */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_promocao && (
              <span className="bg-[#050505] text-[#d4af37] text-[8px] px-3 py-1.5 rounded-[1px] tracking-[0.2em] uppercase font-bold shadow-sm opacity-90 font-sans">Oferta</span>
            )}
            {product.estoque > 0 && product.estoque <= 3 && (
              <span className="bg-[#5a0c0c] text-white text-[8px] px-3 py-1.5 rounded-[1px] tracking-[0.2em] uppercase font-bold shadow-sm opacity-90 font-sans">Últimos</span>
            )}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex flex-col flex-grow font-sans">
          <div className="min-h-[80px] flex flex-col justify-start">
            {/* Product Name - Direct emphasis */}
            <h3 className="text-[15px] md:text-[18px] font-semibold text-stone-800 line-clamp-2 leading-[1.3] group-hover:text-[#d4af37] transition-colors duration-500 tracking-tight mb-4">
              {mainName}
            </h3>
          </div>

          {/* Pricing Block */}
          <div className="mt-2 pt-4 border-t border-stone-100/50 flex flex-col gap-1.5">
             {/* Old Price */}
             <div className="flex justify-between items-center">
               <p className="text-[10px] text-stone-300 line-through font-light tracking-wide italic leading-none">
                 R$ {(product.preco_venda / 0.90).toFixed(2).replace('.', ',')}
               </p>
               <span className="text-[9px] text-stone-400 font-medium uppercase tracking-widest opacity-70">
                 12x s/ juros
               </span>
             </div>
             
             {/* Main Price */}
             <div className="flex items-baseline gap-2">
               <p className="text-[22px] md:text-[24px] font-bold text-stone-900 tracking-tighter leading-none">
                 R$ {product.preco_venda.toFixed(2).replace('.', ',')}
               </p>
             </div>
             
             {/* Pix Price */}
             <div className="flex items-center gap-2 mt-1 mb-6">
               <span className="text-[14px] md:text-[15px] font-extrabold text-[#b89142] tracking-tighter bg-[#b89142]/10 px-2 py-1 rounded-[1px]">
                 R$ {(product.preco_venda * 0.95).toFixed(2).replace('.', ',')}
               </span>
               <span className="text-[9px] text-[#b89142] font-black uppercase tracking-widest">no Pix</span>
             </div>
          </div>
        </div>
      </Link>

      {/* Prominent Buy Button */}
      <button 
        onClick={handleAddToCart}
        className="w-full bg-[#050505] text-[#d4af37] py-4 rounded-sm text-[11px] font-bold uppercase tracking-[0.2em] transform active:scale-95 transition-all duration-300 hover:bg-[#d4af37] hover:text-black mt-auto shadow-lg"
      >
        Adicionar ao Carrinho
      </button>
      
      {/* Subtle Hover Line */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-[#d4af37] w-0 group-hover:w-full transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"></div>
    </div>
  );
}
