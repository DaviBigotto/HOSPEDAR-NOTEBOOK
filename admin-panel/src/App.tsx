import { useState, useEffect, memo } from 'react'
import { 
  Search, Plus, RefreshCw, Moon, Sun, 
  Trash2, Globe, Database, Package, 
  ChevronRight, AlertCircle, ShoppingCart, 
  Droplet, Tag, CheckCircle2, XCircle, LayoutGrid, List
} from 'lucide-react'

interface Product {
  id: string;
  external_id: string;
  nome: string;
  categoria: string;
  imagem_url: string | null;
  preco_custo: number;
  preco_venda: number;
  estoque: number;
  disponivel: boolean;
  publicar_no_site: boolean;
  classificacao: string;
  notas_olfativas: string | null;
  familia_olfativa: string | null;
  projecao: string | null;
  fixacao: string | null;
  ocasiao: string | null;
  volumetria: string | null;
  updated_at: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api/admin";

const AVAILABLE_CATEGORIES = [
  { id: 'Importado', label: 'Importados' },
  { id: 'Tester', label: 'Testers' },
  { id: 'Arabe', label: 'Árabes' },
  { id: 'Victoria', label: 'Victoria\'s Secret' },
  { id: 'Cremes', label: 'Cremes' },
];

const COMMON_VOLUMES = ['30ML', '50ML', '75ML', '100ML', '200ML'];

// --- Sub-Components ---

const PriceInput = memo(({ value, onChange }: { value: number, onChange: (val: number) => void }) => (
  <div className="group relative flex items-center bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-[#cfa858] focus-within:border-transparent">
    <span className="text-stone-400 text-xs font-bold mr-2">R$</span>
    <input
      type="number"
      step="0.01"
      className="bg-transparent font-sans font-bold text-stone-900 dark:text-stone-100 outline-none text-base w-24"
      value={value}
      onChange={e => onChange(parseFloat(e.target.value) || 0)}
    />
    <div className="absolute -top-2 left-3 bg-[#cfa858] text-[8px] font-black text-white px-1.5 rounded uppercase tracking-tighter opacity-0 group-focus-within:opacity-100 transition-opacity">Preço Pix</div>
  </div>
));

const StatusToggle = memo(({ active, onChange }: { active: boolean, onChange: (val: boolean) => void }) => (
  <button 
    onClick={() => onChange(!active)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ring-offset-2 ring-offset-white dark:ring-offset-black focus:ring-2 focus:ring-[#cfa858] ${active ? 'bg-[#cfa858]' : 'bg-stone-200 dark:bg-stone-800'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
));

const ProductCard = memo(({ product, onUpdate, onDelete }: { 
  product: Product, 
  onUpdate: (id: string, field: Partial<Product>) => void,
  onDelete: (id: string, name: string) => void 
}) => {
  const isError = product.preco_venda === 0 || product.estoque === 0;

  return (
    <div className={`group relative bg-white dark:bg-[#1a1a1a] p-4 md:p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${isError ? 'border-rose-200 dark:border-rose-900/30' : 'border-stone-100 dark:border-stone-800'}`}>
      {/* Visual Indicator of Error */}
      {isError && (
        <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg z-10 animate-bounce">
          <AlertCircle size={14} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* IDENTITY ZONE (Left) */}
        <div className="lg:col-span-5 flex items-start gap-4">
          <div className="relative w-20 h-24 md:w-24 md:h-28 bg-stone-50 dark:bg-stone-900 rounded-xl overflow-hidden border border-stone-100 dark:border-stone-800 shrink-0 flex items-center justify-center group/img">
            {product.imagem_url ? (
              <img src={product.imagem_url} alt={product.nome} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover/img:scale-110 p-2" />
            ) : (
              <div className="text-[10px] text-stone-300 uppercase tracking-widest font-bold">No Img</div>
            )}
            <div className="absolute top-0 left-0 bg-stone-800/80 text-white text-[8px] px-1.5 py-0.5 rounded-br-lg font-black tracking-tighter">
              {product.external_id ? 'VENDIZAP' : 'MANUAL'}
            </div>
          </div>
          
          <div className="flex-1 min-w-0 space-y-3">
            <input 
              className="text-lg md:text-xl font-bold text-stone-900 dark:text-white bg-transparent border-b border-transparent hover:border-[#cfa858]/30 focus:border-[#cfa858] outline-none w-full transition-all truncate"
              defaultValue={product.nome}
              onBlur={(e) => e.target.value !== product.nome && onUpdate(product.id, { nome: e.target.value.trim() })}
            />
            
            <div className="flex flex-wrap gap-1.5 pt-1">
              {AVAILABLE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    const currentCats = (product.categoria || '').split(';').filter(Boolean).map(c => c.trim());
                    const cleanedCats = currentCats.map(c => (c.toLowerCase().includes('arable') ? 'Arabe' : c));
                    const filteredCats = cleanedCats.filter(c => AVAILABLE_CATEGORIES.some(ac => ac.id === c) || c === cat.id);
                    const newCats = filteredCats.includes(cat.id) ? filteredCats.filter(c => c !== cat.id) : [...filteredCats, cat.id];
                    onUpdate(product.id, { categoria: [...new Set(newCats)].join(';') });
                  }}
                  className={`text-[9px] px-2 py-1 rounded-md font-black uppercase tracking-widest transition-all border ${
                    (product.categoria || '').split(';').some(c => c.trim() === cat.id)
                      ? 'bg-[#cfa858] text-white border-[#cfa858] shadow-md shadow-[#cfa858]/20'
                      : 'bg-stone-50 dark:bg-stone-900 text-stone-400 border-stone-200 dark:border-stone-800 hover:border-[#cfa858]/50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-1">
               <select
                 className="text-[10px] text-stone-500 font-bold uppercase bg-stone-100 dark:bg-stone-900 rounded-md px-2 py-1 outline-none border border-stone-200 dark:border-stone-800 focus:border-[#cfa858]"
                 value={product.classificacao || 'Unissex'}
                 onChange={(e) => onUpdate(product.id, { classificacao: e.target.value })}
               >
                 <option value="Unissex">UNISSEX</option>
                 <option value="Masculino">MASCULINO</option>
                 <option value="Feminino">FEMININO</option>
               </select>
               <span className="text-[9px] text-stone-300 font-bold uppercase tracking-widest">Gênero</span>
            </div>
          </div>
        </div>

        {/* TECHNICAL ZONE (Center) */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-l border-r border-stone-100 dark:border-stone-800 px-0 lg:px-6">
          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-1.5">Volumetria</label>
              <div className="flex items-center gap-2">
                 <input 
                   className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 focus:border-[#cfa858] outline-none w-20"
                   value={product.volumetria || ''}
                   onChange={(e) => onUpdate(product.id, { volumetria: e.target.value })}
                 />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {COMMON_VOLUMES.map(v => (
                  <button 
                    key={v}
                    onClick={() => onUpdate(product.id, { volumetria: v })}
                    className={`text-[8px] px-1.5 py-0.5 rounded border transition-all ${product.volumetria === v ? 'bg-[#cfa858] text-white border-[#cfa858]' : 'bg-white dark:bg-stone-900 text-stone-400 border-stone-100 dark:border-stone-800'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-1.5">Estoque</label>
              <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-stone-100 dark:bg-stone-900 rounded-lg">
                    <Package size={14} className={product.estoque === 0 ? 'text-rose-500' : 'text-stone-400'} />
                 </div>
                 <input 
                   type="number"
                   className={`font-mono text-sm font-bold bg-transparent border-b border-transparent focus:border-[#cfa858] outline-none w-16 ${product.estoque === 0 ? 'text-rose-500' : 'text-stone-900 dark:text-stone-100'}`}
                   defaultValue={product.estoque}
                   onBlur={(e) => onUpdate(product.id, { estoque: parseInt(e.target.value) || 0 })}
                 />
              </div>
            </div>
            <div>
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block mb-1.5">Custo Ref.</label>
              <div className="flex items-center gap-2">
                 <div className="p-1.5 bg-stone-100 dark:bg-stone-900 rounded-lg">
                    <Database size={14} className="text-stone-400" />
                 </div>
                 <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100">
                   R$ {product.preco_custo.toFixed(2).replace('.', ',')}
                 </span>
              </div>
            </div>
          </div>
        </div>

        {/* FINANCIAL ZONE (Right) */}
        <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4">
           <div className="flex flex-col items-end gap-2">
              <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest block">Edição de Preço</label>
              <PriceInput value={product.preco_venda} onChange={(val) => onUpdate(product.id, { preco_venda: val })} />
              {product.preco_venda === 0 && <span className="text-[9px] font-bold text-rose-500 animate-pulse">Preço Pendente!</span>}
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <StatusToggle active={product.publicar_no_site} onChange={(val) => onUpdate(product.id, { publicar_no_site: val })} />
                <span className={`text-[9px] font-black tracking-widest ${product.publicar_no_site ? 'text-[#cfa858]' : 'text-stone-400'}`}>
                  {product.publicar_no_site ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>

              <button 
                onClick={() => onDelete(product.id, product.nome)}
                className="p-2.5 rounded-lg border border-stone-100 dark:border-stone-800 text-stone-300 hover:border-rose-100 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all group/del"
              >
                <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
});

// --- Main Application ---

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('admin-theme') === 'dark');
  
  // Registration Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "", categoria: "Importado", preco_custo: 0, preco_venda: 0, imagem_url: "", volumetria: ""
  });

  useEffect(() => {
    localStorage.setItem('admin-theme', darkMode ? 'dark' : 'light');
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) setProducts(await res.json());
    } catch (error) {
      console.error("Failed to load products", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch(`${API_BASE}/sync`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("Sincronização concluída com sucesso!");
        fetchProducts();
      } else alert("Erro: " + data.error);
    } catch (err) { alert("Falha de conexão."); }
    setSyncing(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ nome: "", categoria: "Importado", preco_custo: 0, preco_venda: 0, imagem_url: "", volumetria: "" });
        fetchProducts();
      }
    } catch (err) { alert("Erro ao criar produto."); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir o produto "${name}" permanentemente?`)) return;
    try {
      const res = await fetch(`${API_BASE}/products?id=${id}`, { method: "DELETE" });
      if (res.ok) setProducts(products.filter(p => p.id !== id));
    } catch (err) { alert("Erro ao excluir."); }
  };

  const handleUpdate = async (id: string, field: Partial<Product>) => {
    const sanitizedField = { ...field };
    if (sanitizedField.categoria) sanitizedField.categoria = sanitizedField.categoria.replace(/Árables/gi, 'Arabe').replace(/Arables/gi, 'Arabe');
    
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...sanitizedField } : p));
    try {
      await fetch(`${API_BASE}/products`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...sanitizedField })
      });
    } catch (error) { fetchProducts(); }
  };

  const scanVolumes = async () => {
    const volumeRegex = /(\d+\s?ml|\d+\s?g|\d+\s?oz)/i;
    let count = 0;
    for (const p of products) {
      if (!p.volumetria) {
        const match = p.nome.match(volumeRegex);
        if (match) {
          await handleUpdate(p.id, { volumetria: match[0].toUpperCase() });
          count++;
        }
      }
    }
    alert(`${count} produtos atualizados com volumetria encontrada!`);
  };

  const filtered = products.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0a] text-stone-100' : 'bg-stone-50 text-stone-900'}`}>
      
      {/* STICKY HEADER */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${darkMode ? 'bg-[#0a0a0a]/80 border-stone-800' : 'bg-white/80 border-stone-200'}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#cfa858] rounded-xl flex items-center justify-center shadow-lg shadow-[#cfa858]/20">
                  <Database className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">Bigot Admin</h1>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Sistema Operacional</span>
                  </div>
                </div>
              </div>
              
              <div className="h-8 w-[1px] bg-stone-200 dark:bg-stone-800 hidden md:block"></div>
              
              <div className="relative flex-1 md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar perfume no catálogo..." 
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl outline-none border transition-all text-sm ${darkMode ? 'bg-stone-900 border-stone-800 focus:border-[#cfa858]' : 'bg-stone-100 border-stone-200 focus:border-[#cfa858]'}`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl border transition-all ${darkMode ? 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white' : 'bg-stone-100 border-stone-200 text-stone-500 hover:text-black'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button 
                onClick={scanVolumes}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-500/10 text-stone-500 hover:bg-stone-500/20 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
              >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">Scan Volume</span>
              </button>

              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-xs uppercase tracking-[0.15em] hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Cadastrar</span>
              </button>

              <button 
                onClick={handleSync} 
                disabled={syncing}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-xl shadow-[#cfa858]/10 ${syncing ? 'bg-stone-300 text-stone-500 cursor-not-allowed' : 'bg-[#cfa858] text-white hover:bg-black active:scale-95'}`}
              >
                <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{syncing ? 'Sincronizando' : 'Sincronizar'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
        
        {/* STATS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           {[
             { label: 'Total Itens', val: products.length, icon: Package, color: 'text-stone-400' },
             { label: 'No Site', val: products.filter(p => p.publicar_no_site).length, icon: Globe, color: 'text-emerald-500' },
             { label: 'Sem Estoque', val: products.filter(p => p.estoque === 0).length, icon: ShoppingCart, color: 'text-rose-500' },
             { label: 'Erro Preço', val: products.filter(p => p.preco_venda === 0).length, icon: AlertCircle, color: 'text-amber-500' },
           ].map((stat, i) => (
             <div key={i} className={`p-4 rounded-2xl border flex items-center gap-4 ${darkMode ? 'bg-stone-900/40 border-stone-800' : 'bg-white border-stone-100'}`}>
                <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-stone-900' : 'bg-stone-50'} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-400">{stat.label}</div>
                  <div className="text-xl font-bold">{stat.val}</div>
                </div>
             </div>
           ))}
        </div>

        {/* LISTING */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-24 text-center">
               <RefreshCw className="mx-auto mb-4 text-stone-400 animate-spin" size={40} />
               <p className="text-stone-400 font-medium tracking-widest uppercase text-xs">Acessando Banco de Dados...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800">
               <Package className="mx-auto mb-4 text-stone-200 dark:text-stone-800" size={60} />
               <p className="text-stone-400 font-medium tracking-widest uppercase text-xs">Nenhum perfume encontrado sob este critério.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filtered.map(prod => (
                <ProductCard 
                  key={prod.id} 
                  product={prod} 
                  onUpdate={handleUpdate} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* REGISTRATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-[#1a1a1a] border-stone-800' : 'bg-white border-stone-100'}`}>
            <div className="p-8 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Novo Perfume</h2>
                <p className="text-xs text-stone-400 font-medium uppercase tracking-[0.2em] mt-1">Cadastro Manual de Inventário</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                <XCircle size={24} className="text-stone-400" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Designação do Produto</label>
                <input required type="text" className={`w-full px-5 py-3 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-stone-900 border-stone-800 focus:border-[#cfa858]' : 'bg-stone-50 border-stone-200 focus:border-[#cfa858]'}`} value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Armaf Club de Nuit Intense Man" />
              </div>
              
              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Volumetria</label>
                <div className="flex flex-col gap-3">
                  <input type="text" className={`w-full px-5 py-3 rounded-2xl outline-none border transition-all ${darkMode ? 'bg-stone-900 border-stone-800 focus:border-[#cfa858]' : 'bg-stone-50 border-stone-200 focus:border-[#cfa858]'}`} value={formData.volumetria} onChange={e => setFormData({...formData, volumetria: e.target.value})} placeholder="100ML" />
                  <div className="flex flex-wrap gap-2">
                    {COMMON_VOLUMES.map(v => (
                      <button key={v} type="button" onClick={() => setFormData({...formData, volumetria: v})} className={`text-[9px] px-3 py-1.5 rounded-lg border font-black transition-all ${formData.volumetria === v ? 'bg-[#cfa858] text-white border-[#cfa858]' : 'bg-transparent text-stone-400 border-stone-200 dark:border-stone-800 hover:border-[#cfa858]/50'}`}>{v}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Preço Pix (Venda Final)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">R$</span>
                  <input required type="number" step="0.01" className={`w-full pl-12 pr-5 py-3 rounded-2xl outline-none border transition-all font-mono font-bold ${darkMode ? 'bg-stone-900 border-stone-800 focus:border-[#cfa858]' : 'bg-stone-50 border-stone-200 focus:border-[#cfa858]'}`} value={formData.preco_venda} onChange={e => setFormData({...formData, preco_venda: parseFloat(e.target.value)})} />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Categorias Estratégicas</label>
                <div className={`p-4 rounded-2xl border flex flex-wrap gap-3 ${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                   {AVAILABLE_CATEGORIES.map(cat => (
                     <label key={cat.id} className={`flex items-center gap-2 cursor-pointer transition-all px-4 py-2 rounded-xl border ${formData.categoria.includes(cat.id) ? 'bg-[#cfa858] border-[#cfa858] text-white shadow-lg shadow-[#cfa858]/20' : 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800 text-stone-400 hover:border-[#cfa858]/30'}`}>
                        <input type="checkbox" className="sr-only" checked={formData.categoria.includes(cat.id)} onChange={() => {
                          const current = formData.categoria.split(';').filter(Boolean);
                          const next = current.includes(cat.id) ? current.filter(c => c !== cat.id) : [...current, cat.id];
                          setFormData({...formData, categoria: next.join(';')});
                        }} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                        {formData.categoria.includes(cat.id) && <CheckCircle2 size={12} />}
                     </label>
                   ))}
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full py-4 bg-[#cfa858] text-white font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-stone-900 dark:hover:bg-white dark:hover:text-black transition-all shadow-xl shadow-[#cfa858]/20 active:scale-[0.98]">
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
