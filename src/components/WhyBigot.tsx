import { Gem, Sparkles, Box, HeartHandshake } from 'lucide-react';

export default function WhyBigot() {
  const reasons = [
    { icon: Gem, title: "Curadoria Premium", desc: "Apenas as fragrâncias mais excepcionais e desejadas do mundo." },
    { icon: Sparkles, title: "Produtos Autênticos", desc: "Procedência garantida e qualidade inquestionável em cada frasco." },
    { icon: Box, title: "Estoque Selecionado", desc: "Edições limitadas e lançamentos globais rigorosamente selecionados." },
    { icon: HeartHandshake, title: "Atendimento Próximo", desc: "Consultoria olfativa dedicada para elevar sua assinatura pessoal." }
  ];

  return (
    <section className="bg-white text-stone-900 py-24 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4 tracking-wide">Por que a Bigot?</h2>
          <p className="text-stone-500 font-light text-sm md:text-base max-w-2xl mx-auto">Elevamos o padrão do e-commerce de perfumaria fina, garantindo não apenas um produto, mas uma experiência de alto nível.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {reasons.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center mb-6 group-hover:border-[#d4af37] group-hover:bg-[#faf9f7] transition-all duration-500">
                <item.icon className="w-7 h-7 text-stone-800 group-hover:text-[#d4af37] transition-colors duration-500" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-bold tracking-[0.1em] uppercase text-stone-900 mb-3">{item.title}</h3>
              <p className="text-stone-500 text-sm font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
