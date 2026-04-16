import { useState, useEffect } from 'react'

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

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  
  // Registration Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "Importado",
    preco_custo: 0,
    preco_venda: 0,
    imagem_url: ""
  });

  const toggleCategoryInForm = (catId: string) => {
    const currentCats = (formData.categoria || '').split(';').filter(Boolean);
    const newCats = currentCats.includes(catId)
      ? currentCats.filter(c => c !== catId)
      : [...currentCats, catId];
    setFormData({ ...formData, categoria: newCats.join(';') });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (res.ok) {
        setProducts(await res.json());
      }
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
        alert(data.message);
        fetchProducts();
      } else {
        alert("Erro na sincronização: " + data.error);
      }
    } catch (err) {
      alert("Falha de conexão.");
    }
    setSyncing(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({ nome: "", categoria: "Importado", preco_custo: 0, preco_venda: 0, imagem_url: "" });
        fetchProducts();
      }
    } catch (err) {
      alert("Erro ao criar produto.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja apagar o produto "${name}"? Esta ação é definitiva.`)) return;

    try {
      const res = await fetch(`${API_BASE}/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {
      alert("Erro ao excluir.");
    }
  };

  const handleUpdate = async (id: string, field: Partial<Product>) => {
    try {
      // Normalize categoria to fix typos like "Árables"
      if (field.categoria) {
        field.categoria = field.categoria.replace(/Árables/gi, 'Arabe').replace(/Arables/gi, 'Arabe');
      }

      await fetch(`${API_BASE}/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...field })
      });
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const filtered = products.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen p-8 max-w-[1600px] mx-auto bg-[#fafafa]">
      
      {/* MODAL CADASTRAR */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-serif text-gray-900">Novo Perfume</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nome do Produto</label>
                <input required type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#cfa858] transition-all" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Ex: Bleu de Chanel Parfum" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Categorias (Selecione uma ou mais)</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    {AVAILABLE_CATEGORIES.map(cat => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer group bg-white px-3 py-1.5 rounded border border-gray-100 hover:border-[#cfa858] transition-all">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-[#cfa858] focus:ring-[#cfa858]"
                          checked={(formData.categoria || '').split(';').includes(cat.id)}
                          onChange={() => toggleCategoryInForm(cat.id)}
                        />
                        <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900">{cat.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Stock Inicial</label>
                  <input type="number" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#cfa858]" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Preço Custo</label>
                  <input type="number" step="0.01" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#cfa858]" value={formData.preco_custo} onChange={e => setFormData({...formData, preco_custo: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Preço Pix (Base)</label>
                  <input required type="number" step="0.01" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#cfa858]" value={formData.preco_venda} onChange={e => setFormData({...formData, preco_venda: parseFloat(e.target.value)})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">URL da Imagem</label>
                <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#cfa858]" value={formData.imagem_url} onChange={e => setFormData({...formData, imagem_url: e.target.value})} placeholder="https://..." />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-3 bg-[#cfa858] text-[#1a1a1a] font-bold rounded-lg hover:bg-black hover:text-white transition-all shadow-lg shadow-[#cfa858]/20">
                  Cadastrar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">Painel Executivo: Bigot</h1>
          <p className="text-sm text-gray-500 mt-1 font-light">Gestão de catálogo e vitrine em tempo real.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded bg-white border border-gray-200 text-gray-700 text-sm uppercase tracking-widest font-semibold hover:bg-gray-50 transition-all shadow-sm"
          >
            + Novo Produto
          </button>
          <button 
            onClick={handleSync} 
            disabled={syncing}
            className={`px-5 py-2.5 rounded shadow-sm text-sm uppercase tracking-widest font-semibold transition-all ${syncing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#1a1a1a] text-[#cfa858] hover:bg-[#cfa858] hover:text-[#1a1a1a] shadow-lg shadow-[#cfa858]/20 hover:-translate-y-0.5'}`}
          >
            {syncing ? 'Sincronizando...' : '⟳ Sincronizar Vendizap'}
          </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
         <div className="relative w-full max-w-md">
           <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           <input 
             type="text" 
             placeholder="Buscar perfume pelo nome..." 
             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#cfa858]/50 focus:border-[#cfa858] bg-gray-50/50 text-sm"
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
         </div>
         <div className="text-xs text-gray-400 font-medium">
            {filtered.length} {filtered.length === 1 ? 'Produto' : 'Produtos'} listados
         </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-200">
                <th className="py-4 px-6 font-semibold">Produto</th>
                <th className="py-4 px-6 font-semibold">Dados Técnicos</th>
                <th className="py-4 px-6 font-semibold">Preço Pix</th>
                <th className="py-4 px-6 font-semibold text-center">Site</th>
                <th className="py-4 px-6 font-semibold text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm bg-white">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400 italic">Carregando catálogo...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400 font-light">Nenhum produto encontrado.</td></tr>
              ) : (
                filtered.map(prod => (
                  <tr key={prod.id} className="hover:bg-gray-50/40 transition-colors">
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0 flex items-center justify-center relative group">
                           {prod.imagem_url ? (
                             <img src={prod.imagem_url} alt={prod.nome} className="w-full h-full object-cover mix-blend-multiply transition group-hover:scale-110" />
                           ) : (
                             <span className="text-[10px] text-gray-400">N/A</span>
                           )}
                           <div className="absolute top-0 left-0 text-[8px] bg-black/60 text-white px-1 leading-tight rounded-br">
                              {(prod as any).origem === 'MANUAL' ? 'Manual' : 'Zap'}
                           </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <input 
                            title="Editar Nome do Produto"
                            className="font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-200 focus:border-[#cfa858] outline-none w-full max-w-[280px] leading-tight transition-all truncate"
                            defaultValue={prod.nome}
                            onBlur={(e) => {
                              if (e.target.value.trim() !== prod.nome) {
                                handleUpdate(prod.id, { nome: e.target.value.trim() });
                              }
                            }}
                          />
                          <div className="mt-3">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2 block">Categorias</label>
                            <div className="flex flex-wrap gap-1.5">
                              {AVAILABLE_CATEGORIES.map(cat => (
                                <button
                                  key={cat.id}
                                  onClick={() => {
                                    const currentCats = (prod.categoria || '').split(';').filter(Boolean).map(c => c.trim());
                                    const cleanedCats = currentCats.map(c => (c.toLowerCase().includes('arable') ? 'Arabe' : c));
                                    const filteredCats = cleanedCats.filter(c => AVAILABLE_CATEGORIES.some(ac => ac.id === c) || c === cat.id);
                                    
                                    const newCats = filteredCats.includes(cat.id)
                                      ? filteredCats.filter(c => c !== cat.id)
                                      : [...filteredCats, cat.id];
                                    
                                    handleUpdate(prod.id, { categoria: [...new Set(newCats)].join(';') });
                                  }}
                                  className={`text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider transition-all border ${
                                    (prod.categoria || '').split(';').some(c => c.trim() === cat.id)
                                      ? 'bg-[#cfa858] text-[#1a1a1a] border-[#cfa858] shadow-sm'
                                      : 'bg-white text-gray-300 border-gray-100 hover:border-gray-200'
                                  }`}
                                >
                                  {cat.label}
                                </button>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-50">
                               <div className="flex items-center gap-1.5">
                                 <span className="text-gray-300 text-[9px] font-bold uppercase">Gênero:</span>
                                 <select
                                   className="text-[9px] text-gray-600 font-bold uppercase bg-gray-50 hover:bg-gray-100 rounded px-2 py-0.5 outline-none transition-colors"
                                   value={prod.classificacao || 'Unissex'}
                                   onChange={(e) => handleUpdate(prod.id, { classificacao: e.target.value })}
                                 >
                                   <option value="Unissex">UNISSEX</option>
                                   <option value="Masculino">MASCULINO</option>
                                   <option value="Feminino">FEMININO</option>
                                 </select>
                               </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                         <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-[10px] uppercase font-bold">Custo:</span>
                            <span className="font-mono text-gray-600 font-semibold">R$ {prod.preco_custo.toFixed(2)}</span>
                         </div>
                         <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-[10px] uppercase font-bold">Estoque:</span>
                            <span className={`text-xs font-bold ${prod.estoque > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{prod.estoque}</span>
                         </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="inline-flex items-center bg-gray-50 border border-gray-200 rounded px-2 py-1 shadow-inner focus-within:border-[#cfa858] transition-all">
                        <span className="text-gray-400 text-xs font-medium mr-1">R$</span>
                        <input
                           type="number"
                           step="0.01"
                           className="w-20 bg-transparent font-bold text-gray-900 outline-none text-sm"
                           value={prod.preco_venda}
                           onChange={e => handleUpdate(prod.id, { preco_venda: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex flex-col items-center gap-1">
                        <label className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={prod.publicar_no_site}
                            onChange={(e) => handleUpdate(prod.id, { publicar_no_site: e.target.checked })}
                          />
                          <div className={`w-10 h-5 rounded-full transition relative ${prod.publicar_no_site ? 'bg-[#cfa858]' : 'bg-gray-200 group-hover:bg-gray-300'}`}>
                             <div className={`w-4 h-4 bg-white rounded-full absolute top-[2px] shadow-sm transform transition-all ${prod.publicar_no_site ? 'left-[22px]' : 'left-[2px]'}`}></div>
                          </div>
                        </label>
                        <span className={`text-[8px] font-black tracking-tighter ${prod.publicar_no_site ? 'text-[#cfa858]' : 'text-gray-400'}`}>
                          {prod.publicar_no_site ? 'ATIVO' : 'OFF'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <button 
                        onClick={() => handleDelete(prod.id, prod.nome)}
                        className="w-8 h-8 rounded-full border border-gray-100 text-gray-300 hover:border-red-100 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center group"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default App
