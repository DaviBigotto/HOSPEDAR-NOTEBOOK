import { ShieldCheck, Truck, Lock, Crown } from 'lucide-react';

export default function TrustBar() {
  const items = [
    { icon: ShieldCheck, title: "Originalidade Garantida", text: "Selos de autenticidade reais" },
    { icon: Truck, title: "Envio Expresso", text: "Cobertura para todo o Brasil" },
    { icon: Lock, title: "Compra Segura", text: "Pagamento criptografado" },
    { icon: Crown, title: "Atendimento Premium", text: "Especialistas em perfumaria" },
  ];

  return (
    <section className="w-full bg-[#030303] py-12 border-y border-stone-800/50 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-stone-800/50">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center px-4 group">
              <item.icon className="w-8 h-8 text-[#d4af37] mb-4 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" strokeWidth={1} />
              <h4 className="text-[10px] md:text-xs font-bold text-stone-200 tracking-[0.15em] uppercase mb-1.5">{item.title}</h4>
              <p className="text-[9px] md:text-[10px] text-stone-500 font-light tracking-wide">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"></div>
    </section>
  );
}
