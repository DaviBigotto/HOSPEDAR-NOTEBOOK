import { Star } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    { name: "Carlos M.", text: "A apresentação e o cuidado com a entrega são de outro nível. O perfume chegou intacto e com uma projeção incrível." },
    { name: "Fernanda T.", text: "Encontrei minha assinatura olfativa com a curadoria da Bigot. Produto 100% autêntico e atendimento perfeitamente cortês." },
    { name: "Roberto L.", text: "Experiência de boutique sem sair de casa. O Tester de Nicho que comprei estava impecável e com fixação eterna na pele." },
  ];

  return (
    <section className="bg-[#030303] py-24 relative overflow-hidden">
      {/* Decorative large quotes */}
      <div className="absolute top-10 left-10 text-[20rem] text-stone-900/40 font-serif leading-none select-none pointer-events-none">&ldquo;</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[#d4af37] text-xs font-bold tracking-[0.2em] uppercase mb-4 block">Experiência</span>
          <h2 className="text-3xl md:text-4xl font-serif text-stone-100">O que nossos clientes dizem</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
             <div key={i} className="bg-[#0a0a0a] border border-stone-800 p-8 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:border-[#d4af37]/30 transition-colors duration-500 flex flex-col">
               <div className="flex gap-1 mb-6 text-[#d4af37]">
                 {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
               </div>
               <p className="text-stone-300 font-light text-sm leading-relaxed mb-8 italic flex-grow">
                 "{rev.text}"
               </p>
               <div className="text-xs font-bold text-stone-100 tracking-widest uppercase">
                 — {rev.name}
               </div>
             </div>
          ))}
        </div>
      </div>
    </section>
  );
}
