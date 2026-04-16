import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductActions from '@/components/ProductActions';
import { Sparkles, Wind, Clock, Calendar, Bookmark, Map } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!product) {
    notFound();
  }

  // Format currency
  const precoRegular = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_venda / 0.95);
  const precoPix = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco_venda);

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
    
    // Clean up category/brand info
    let brand = (product.marca || product.categoria || '').split('/')[0].trim();
    if (brand.toLowerCase().includes('fornecedor')) brand = 'Importado';
    
    return {
      topLabel: brand.toUpperCase(),
      mainName: formatTitle(nameWithoutVolume.split('-')[0].trim()),
      bottomLabel: volume.toUpperCase()
    };
  };

  const { topLabel, mainName, bottomLabel } = parseProductName(product.nome);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        
        {/* Breadcrumb - Compact on Mobile */}
        <nav className="flex text-[10px] text-stone-400 mb-6 md:mb-12 uppercase tracking-[0.2em] font-bold overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <Link href="/" className="hover:text-[#d4af37] transition-colors">Início</Link>
          <span className="mx-2 md:mx-3 opacity-30">/</span>
          <Link href="/importados" className="hover:text-[#d4af37] transition-colors">{product.categoria}</Link>
          <span className="mx-2 md:mx-3 opacity-30">/</span>
          <span className="text-stone-900 truncate max-w-[150px] md:max-w-[200px]">{product.nome}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-32">
          
          <div className="w-full lg:w-1/2">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] bg-white rounded-sm overflow-hidden border border-stone-100 shadow-2xl flex items-center justify-center p-6 md:p-12 group">
                {product.imagem_url ? (
                  <Image 
                    src={product.imagem_url} 
                    alt={product.nome} 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-contain mix-blend-darken scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out p-4 md:p-8"
                  />
                ) : (
                  <span className="text-stone-200 tracking-[0.3em] uppercase text-xs font-light font-serif">Sem Imagem</span>
                )}
                
                {product.is_promocao && (
                  <span className="absolute top-4 left-4 md:top-8 md:left-8 bg-stone-900 text-[#d4af37] text-[8px] md:text-[10px] px-3 py-1.5 md:px-4 md:py-2 rounded-sm uppercase tracking-[0.2em] font-bold shadow-2xl z-10">Oferta Exclusiva</span>
                )}
              </div>
            </div>
          </div>

          {/* Produto Info */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <div className="border-b border-stone-100 pb-10 mb-10 text-left">
              {(product as any).classificacao && (
                <p className="text-[10px] font-bold text-[#d4af37] mb-6 tracking-[0.3em] uppercase flex items-center gap-3">
                  <span>{(product as any).classificacao}</span>
                </p>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-sans font-bold text-stone-900 mb-6 leading-[1.1] tracking-tighter">
                {mainName}
              </h1>
              
              <div className="flex flex-col gap-2 mb-10">
                {/* Old Price */}
                <span className="text-sm text-stone-400 line-through font-light tracking-wide">
                  R$ {(product.preco_venda / 0.95 / 0.90).toFixed(2).replace('.', ',')}
                </span>
                
                <div className="flex flex-col md:flex-row md:items-baseline gap-4">
                  {/* Main Price (Pix) */}
                  <span className="text-4xl md:text-6xl font-semibold text-stone-900 tracking-tighter">
                    {precoPix}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500">no Pix</span>
                </div>
                
                {/* Regular Price & Installments */}
                <div className="mt-4 space-y-1">
                  <p className="text-sm text-stone-500 font-medium uppercase tracking-widest">
                    ou <span className="text-stone-900 font-bold">{precoRegular}</span> à vista
                  </p>
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-widest">
                    ou 12x de <span className="text-stone-900 font-bold">R$ {(product.preco_venda / 0.95 / 12).toFixed(2).replace('.', ',')}</span> sem juros
                  </p>
                </div>
              </div>

              <div className="mb-10">
                <ProductActions product={product} />
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className={`w-2 h-2 rounded-full ${product.disponivel && product.estoque > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-stone-300'}`}></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500">
                   {product.disponivel && product.estoque > 0 ? `Disponível em Estoque` : 'Indisponível no Momento'}
                </span>
              </div>
            </div>

            {/* Identidade Olfativa */}
            <div className="mb-12">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 mb-8 border-l-2 border-[#d4af37] pl-4">Ficha Técnica</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                <div className="flex gap-4">
                  <Sparkles className="w-5 h-5 text-[#d4af37] shrink-0" strokeWidth={1.5} />
                  <div>
                    <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Família Olfativa</span>
                    <span className="text-sm font-medium text-stone-800">{(product as any).familia_olfativa || 'Não especificada'}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Wind className="w-5 h-5 text-[#d4af37] shrink-0" strokeWidth={1.5} />
                  <div>
                    <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Projeção</span>
                    <span className="text-sm font-medium text-stone-800">{(product as any).projecao || 'Consulte nossos especialistas'}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-5 h-5 text-[#d4af37] shrink-0" strokeWidth={1.5} />
                  <div>
                    <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Fixação</span>
                    <span className="text-sm font-medium text-stone-800">{(product as any).fixacao || 'Longa duração garantida'}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Calendar className="w-5 h-5 text-[#d4af37] shrink-0" strokeWidth={1.5} />
                  <div>
                    <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-1">Ocasião Ideal</span>
                    <span className="text-sm font-medium text-stone-800">{(product as any).ocasiao || 'Presença marcante'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-white border border-stone-100 rounded-sm">
                <span className="block text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Bookmark className="w-3 h-3" />
                  Pirâmide Olfativa
                </span>
                <p className="text-sm font-serif italic text-stone-600 leading-relaxed">
                  {(product as any).notas_olfativas || 'Notas de saída, corpo e fundo harmoniosamente combinadas para uma assinatura única. Entre em contato para detalhes completos da pirâmide.'}
                </p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
