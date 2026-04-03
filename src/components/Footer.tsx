import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-stone-400 pt-20 pb-10 border-t border-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          <div className="md:col-span-4 lg:col-span-5">
            <Link href="/" className="inline-block mb-6 text-2xl font-serif text-white tracking-[0.1em] uppercase">
              Bigot Parfums
            </Link>
            <p className="text-sm font-light leading-relaxed max-w-sm">
              Mais do que vender perfumes, oferecemos uma curadoria olfativa premium. Garantimos autenticidade, excelência e sofisticação em cada frasco importado.
            </p>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-white text-xs font-bold tracking-[0.15em] uppercase mb-6">Políticas</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link href="/" className="hover:text-[#d4af37] transition-colors">Política de Entrega</Link></li>
              <li><Link href="/" className="hover:text-[#d4af37] transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/" className="hover:text-[#d4af37] transition-colors">Termos de Uso</Link></li>
              <li><Link href="/" className="hover:text-[#d4af37] transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="text-white text-xs font-bold tracking-[0.15em] uppercase mb-6">Atendimento Premium</h4>
            <ul className="space-y-4 text-sm font-light">
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded border border-stone-800 flex items-center justify-center text-[#d4af37]">W</span>
                <a href="#" className="hover:text-[#d4af37] transition-colors">(11) 99999-9999</a>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded border border-stone-800 flex items-center justify-center text-[#d4af37]">Ig</span>
                <a href="#" className="hover:text-[#d4af37] transition-colors">@bigotparfums</a>
              </li>
            </ul>
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-stone-600 mb-3">Newsletter</p>
              <div className="flex">
                <input type="email" placeholder="Seu e-mail" className="bg-stone-900 border border-stone-800 text-sm px-4 py-2 w-full outline-none focus:border-[#d4af37] text-white" />
                <button className="bg-[#d4af37] text-black px-4 font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors">Assinar</button>
              </div>
            </div>
          </div>
          
        </div>

        <div className="border-t border-stone-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light">
          <p>© {new Date().getFullYear()} Bigot Parfums. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
             <span className="opacity-50">Pagamento Seguro</span>
             <span className="opacity-50">100% Original</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
