import { prisma } from '@/lib/prisma';
import ProductCard from './ProductCard';

export default async function CategoryPageTemplate({ title, categoryFilter }: { title: string, categoryFilter: string }) {
  const products = await prisma.product.findMany({
    where: {
      publicar_no_site: true,
      disponivel: true,
      categoria: {
        contains: categoryFilter
      }
    },
    orderBy: {
      nome: 'asc'
    }
  });

  return (
    <div className="w-full pb-12 md:pb-24">
      <div className="flex flex-col items-center mb-8 md:mb-16 text-center">
        <span className="text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Coleção</span>
        <h1 className="text-4xl md:text-6xl font-serif text-stone-900 mb-4 tracking-tight">{title}</h1>
      </div>

      {products.length === 0 ? (
         <div className="text-center py-20 bg-white border border-stone-200 rounded-sm shadow-sm">
           <p className="text-stone-500 font-light">Nenhum produto encontrado nesta categoria no momento.</p>
         </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
