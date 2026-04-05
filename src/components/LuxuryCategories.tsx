import Link from 'next/link';

export default function LuxuryCategories() {
  const categories = [
    { title: "Masculinos", subtitle: "Presença Forte", href: "/importados", colSpan: "col-span-12 md:col-span-6 lg:col-span-4", bgId: 1 },
    { title: "Femininos", subtitle: "Elegância Delicada", href: "/importados", colSpan: "col-span-12 md:col-span-6 lg:col-span-4", bgId: 2 },
    { title: "Body Splash", subtitle: "Victoria's Secret", href: "/victoria-secret", colSpan: "col-span-12 md:col-span-12 lg:col-span-4", bgId: 3 },
    { title: "Testers", subtitle: "Aroma Original", href: "/testers", colSpan: "col-span-12 md:col-span-6", bgId: 4 },
    { title: "Exclusivos", subtitle: "Edições Limitadas", href: "/importados", colSpan: "col-span-12 md:col-span-6", bgId: 5 },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="flex flex-col items-center mb-16 text-center">
        <span className="w-10 h-0.5 bg-[#d4af37] mb-6"></span>
        <h2 className="text-3xl md:text-5xl font-serif text-stone-900 mb-4 tracking-wide">Coleções</h2>
        <p className="text-stone-500 font-light text-sm md:text-base tracking-widest uppercase">Explore por sua preferência</p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 lg:gap-8">
        {categories.map((cat, i) => (
          <Link key={i} href={cat.href} className={`relative group overflow-hidden bg-stone-900 rounded-lg shadow-2xl h-[300px] md:h-[400px] block ${cat.colSpan}`}>
            {/* Dark abstract backgrounds mimicking perfume macro shots or liquid */}
            <div className={`absolute inset-0 transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-50`} 
                 style={{ 
                   background: cat.bgId === 1 ? 'linear-gradient(to bottom right, #111, #222)' :
                               cat.bgId === 2 ? 'linear-gradient(to bottom right, #2a2022, #111)' :
                               cat.bgId === 3 ? 'linear-gradient(to bottom right, #331520, #0a0508)' :
                               cat.bgId === 4 ? 'linear-gradient(to bottom right, #1a1f18, #000)' :
                               'linear-gradient(to bottom right, #2c2512, #050505)'
                 }}>
               {/* Decorative noise/texture could go here via pseudo-element/CSS if available */}
               <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#000]/40 to-[#000]"></div>
            </div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
              <span className="text-[10px] md:text-xs tracking-[0.3em] text-[#d4af37] font-bold uppercase mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                {cat.subtitle}
              </span>
              <h3 className="text-2xl md:text-4xl font-serif text-[#f8f5ee] tracking-wider drop-shadow-lg transform transition-transform duration-500 group-hover:-translate-y-2">
                {cat.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
