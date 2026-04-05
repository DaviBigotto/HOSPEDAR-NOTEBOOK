import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BuscaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  
  const products = await prisma.product.findMany({
    where: {
      publicar_no_site: true,
      disponivel: true,
      ...(q ? {
        OR: [
          { nome: { contains: q } },
          { marca: { contains: q } },
          { categoria: { contains: q } }
        ]
      } : {})
    },
    orderBy: {
      nome: 'asc'
    }
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div className="w-full">
        <div className="border-b border-stone-200 pb-6 mb-10 w-full text-center">
          <h1 className="text-3xl md:text-5xl font-serif text-stone-900 uppercase tracking-[0.2em]">Resultados da Busca</h1>
          {q && (
            <p className="mt-4 text-stone-500 text-sm md:text-base tracking-widest uppercase">
              Buscando por: <span className="font-bold text-gold-dark">"{q}"</span>
            </p>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-stone-200 rounded-3xl shadow-sm">
            <p className="text-stone-500">Nenhum produto encontrado para esse termo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product: any) => (
              <Link key={product.id} href={`/produto/${product.id}`} className="group relative bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-stone-100 hover:shadow-xl hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 text-left flex flex-col h-full">
                <div className="relative aspect-[3/4] bg-stone-50/50 rounded-xl overflow-hidden mb-4 border border-stone-50">
                  {product.imagem_url ? (
                    <img src={product.imagem_url} alt={product.nome} className="object-cover w-full h-full mix-blend-darken scale-95 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">SEM IMAGEM</div>
                  )}
                  {product.is_promocao && (
                    <span className="absolute top-2 left-2 bg-stone-900 text-white text-[9px] md:text-[10px] px-2 py-1 rounded tracking-wider uppercase font-bold shadow-md">OFERTA</span>
                  )}
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-[9px] md:text-[10px] tracking-[0.15em] text-gold-dark uppercase mb-1.5 font-bold">{product.categoria}</p>
                    <h3 className="text-xs md:text-sm text-stone-800 font-medium line-clamp-2 min-h-[2.5rem] leading-relaxed group-hover:text-gold-dark transition-colors">{product.nome}</h3>
                  </div>
                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <p className="text-base md:text-lg font-semibold text-stone-900 tracking-wide">R$ {product.preco_venda.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
