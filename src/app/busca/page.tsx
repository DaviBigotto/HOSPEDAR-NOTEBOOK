import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
      <div className="w-full">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Busca</span>
          <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-4 tracking-tight">Resultados</h1>
          {q && (
            <p className="mt-4 text-stone-500 text-sm md:text-base tracking-widest uppercase">
              Buscando por: <span className="font-bold text-[#d4af37]">"{q}"</span>
            </p>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-stone-200 rounded-sm shadow-sm">
            <p className="text-stone-500 font-light">Nenhum produto encontrado para esse termo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
