import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import TrustBar from '@/components/TrustBar';
import LuxuryCategories from '@/components/LuxuryCategories';
import HighlightBanner from '@/components/HighlightBanner';
import WhyBigot from '@/components/WhyBigot';
import Testimonials from '@/components/Testimonials';

export default async function Home() {
  const destaques = await prisma.product.findMany({
    where: {
      publicar_no_site: true,
      disponivel: true,
    },
    take: 8,
    orderBy: { updated_at: 'desc' }
  });

  return (
    <div className="flex flex-col w-full">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#050505] isolate border-none m-0 p-0">
        <div className="absolute inset-0 z-0 bg-[#050505]">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="object-cover object-center w-full h-full mix-blend-screen opacity-90" 
          >
            <source src="/Projeto de Vídeo.mp4" type="video/mp4" />
          </video>
          {/* Subtle gradient overlay for text readability on mobile */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#050505] to-transparent z-10" />
          <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10" />
        </div>

        <div className="z-20 text-center max-w-3xl px-6 flex flex-col items-center">
          <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-[#d4af37] mb-4 uppercase inline-block">
            Bigot Parfums
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-[#f8f5ee] mb-6 leading-tight drop-shadow-lg">
            A Essência da Elegância
          </h1>
          <p className="text-base md:text-xl text-stone-300 font-light mb-10 max-w-lg mx-auto leading-relaxed">
            Descubra as fragrâncias importadas mais desejadas com autenticidade garantida e preços incríveis.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto">
            <Link href="/importados" className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-md text-[#d4af37] border border-[#d4af37]/50 font-bold tracking-[0.15em] rounded-sm hover:-translate-y-1 hover:bg-[#d4af37] hover:text-black hover:border-[#d4af37] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] text-xs uppercase">
              Ver Catálogo
            </Link>
            <Link href="/victoria-secret" className="w-full sm:w-auto px-10 py-4 bg-transparent border border-stone-500 text-stone-300 font-bold tracking-[0.1em] rounded-sm hover:border-white hover:text-white transition-all duration-300 text-xs uppercase">
              Descubra Victoria's
            </Link>
          </div>
        </div>
      </section>
      
      <TrustBar />

      {/* Destaques Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Desejados</span>
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4 tracking-wide">Destaques da Maison</h2>
          <p className="text-stone-500 font-light text-sm md:text-base max-w-lg">Nossa seleção minuciosa das fragrâncias de assinatura mais cobiçadas.</p>
        </div>
        
        {destaques.length === 0 ? (
          <div className="p-12 border border-stone-200 bg-white rounded-3xl shadow-sm">
            <p className="text-stone-500">Nenhum produto publicado no site ainda. Em breve teremos novidades!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {destaques.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/importados" className="inline-flex items-center justify-center text-xs font-bold uppercase tracking-[0.15em] text-stone-800 hover:text-[#d4af37] transition-all border-b border-stone-800 hover:border-[#d4af37] pb-1 group">
            Ver Todos os Produtos
            <svg className="w-4 h-4 ml-3 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <LuxuryCategories />
      <HighlightBanner />
      <WhyBigot />
      <Testimonials />
    </div>
  );
}

import ProductCard from '@/components/ProductCard';
