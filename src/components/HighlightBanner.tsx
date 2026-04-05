import Link from 'next/link';

export default function HighlightBanner() {
  return (
    <section className="w-full relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden bg-[#050505] py-20">
      {/* Background with centered gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10" />
        <div className="absolute inset-0 bg-radial-gradient from-white/5 to-transparent z-10 opacity-30" />
        <div className="w-full h-full bg-[#0a0a0a] scale-105"></div>
      </div>
      
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center">
        <div className="max-w-2xl">
          <span className="text-[#d4af37] text-xs font-bold tracking-[0.3em] uppercase mb-6 block opacity-80 decoration-[#d4af37]/30 underline-offset-8">
            Manifesto Bigot
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#f8f5ee] mb-8 leading-[1.2] tracking-tight">
            Fragrâncias para quem <br className="hidden md:block" /> valoriza presença.
          </h2>
          <p className="text-stone-400 text-base md:text-lg font-light mb-12 max-w-lg mx-auto leading-relaxed italic border-l-0 md:border-l border-[#d4af37]/20 md:pl-0">
            Uma curadoria rigorosa das melhores coleções mundiais. <br className="hidden sm:block" /> Descubra a sofisticação e a autenticidade de ser inesquecível.
          </p>
          <div className="flex justify-center">
            <Link href="/importados" className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden border border-[#d4af37]/50 text-[#d4af37] font-bold tracking-[0.2em] uppercase text-[10px] transition-all duration-500 hover:text-black">
              <span className="absolute inset-0 w-0 bg-[#d4af37] transition-all duration-300 ease-out group-hover:w-full"></span>
              <span className="relative z-10">Explorar Curadoria</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
