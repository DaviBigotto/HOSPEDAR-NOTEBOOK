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

const API_BASE = "http://localhost:3000/api/admin";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");

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
        fetchProducts(); // Refresh list after sync
      } else {
        alert("Erro na sincronização: " + data.error);
      }
    } catch (err) {
      alert("Falha de conexão.");
    }
    setSyncing(false);
  };

  const handleUpdate = async (id: string, updates: Partial<Product>) => {
    // Optimistic UI update
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    
    try {
      await fetch(`${API_BASE}/products`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates })
      });
    } catch (err) {
      console.error("Failed to update ID: " + id);
      fetchProducts(); // Revert on failure
    }
  };

  const filtered = products.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen p-8 max-w-[1600px] mx-auto">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-serif text-gray-900 tracking-tight">Painel Executivo: Bigot</h1>
          <p className="text-sm text-gray-500 mt-1 font-light">Gestão de catálogo e vitrine em tempo real.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSync} 
            disabled={syncing}
            className={`px-5 py-2.5 rounded shadow-sm text-sm uppercase tracking-widest font-semibold transition-all ${syncing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#1a1a1a] text-[#cfa858] hover:bg-[#cfa858] hover:text-[#1a1a1a] shadow-lg shadow-[#cfa858]/20 hover:-translate-y-0.5'}`}
          >
            {syncing ? 'Sincronizando... Isto pode levar até 2 min' : '⟳ Sincronizar Vendizap'}
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
                <th className="py-4 px-6 font-semibold">Fornecedor</th>
                <th className="py-4 px-6 font-semibold">Margem & Venda</th>
                <th className="py-4 px-6 font-semibold text-center">Status Público</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan={4} className="py-12 text-center text-gray-400">Carregando catálogo...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-gray-400">Nenhum produto encontrado.</td></tr>
              ) : (
                filtered.map(prod => (
                  <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Produto / Imagem / Nome */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                           {prod.imagem_url ? (
                             <img src={prod.imagem_url} alt={prod.nome} className="w-full h-full object-cover mix-blend-multiply" />
                           ) : (
                             <span className="text-[10px] text-gray-400">FOTO</span>
                           )}
                        </div>
                        <div className="flex-1">
                          <input 
                            title="Editar Nome do Produto"
                            className="font-medium text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#cfa858] outline-none w-full max-w-[280px] leading-snug transition-colors truncate"
                            defaultValue={prod.nome}
                            onBlur={(e) => {
                              if (e.target.value.trim() !== prod.nome) {
                                handleUpdate(prod.id, { nome: e.target.value.trim() });
                              }
                            }}
                          />
                          <div className="flex gap-2 items-center mt-2 pb-2">
                            <div className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-semibold uppercase tracking-widest">
                              {prod.categoria}
                            </div>
                            <select
                              className="text-[10px] text-[#b89142] font-semibold uppercase tracking-widest bg-transparent border border-gray-200 rounded outline-none focus:border-[#cfa858] focus:ring-1 focus:ring-[#cfa858] px-1 py-0.5 cursor-pointer"
                              value={prod.classificacao || 'Unissex'}
                              onChange={(e) => handleUpdate(prod.id, { classificacao: e.target.value })}
                            >
                              <option value="Unissex">UNISSEX</option>
                              <option value="Masculino">MASCULINO</option>
                              <option value="Feminino">FEMININO</option>
                            </select>
                          </div>
                          <details className="mt-2 text-xs group">
                            <summary className="cursor-pointer text-gray-400 hover:text-[#cfa858] font-medium transition-colors list-none flex items-center gap-1">
                              <svg className="w-3 h-3 transform group-open:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                              Ficha Olfativa
                            </summary>
                            <div className="mt-3 grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-inner">
                               <div>
                                  <label className="block text-[9px] uppercase tracking-wider text-gray-500 mb-1">Família Olfativa</label>
                                  <input type="text" className="w-full text-xs px-2 py-1 border border-gray-200 rounded focus:border-[#cfa858] outline-none bg-white" placeholder="Ex: Amadeirado Especiado" defaultValue={prod.familia_olfativa || ''} onBlur={e => handleUpdate(prod.id, { familia_olfativa: e.target.value })} />
                               </div>
                               <div>
                                  <label className="block text-[9px] uppercase tracking-wider text-gray-500 mb-1">Ocasiao Ideal</label>
                                  <input type="text" className="w-full text-xs px-2 py-1 border border-gray-200 rounded focus:border-[#cfa858] outline-none bg-white" placeholder="Ex: Noite, Inverno" defaultValue={prod.ocasiao || ''} onBlur={e => handleUpdate(prod.id, { ocasiao: e.target.value })} />
                               </div>
                               <div className="col-span-2">
                                  <label className="block text-[9px] uppercase tracking-wider text-gray-500 mb-1">Notas Principais</label>
                                  <input type="text" className="w-full text-xs px-2 py-1 border border-gray-200 rounded focus:border-[#cfa858] outline-none bg-white" placeholder="Ex: Baunilha, Couro, Bergamota" defaultValue={prod.notas_olfativas || ''} onBlur={e => handleUpdate(prod.id, { notas_olfativas: e.target.value })} />
                               </div>
                               <div>
                                  <label className="block text-[9px] uppercase tracking-wider text-gray-500 mb-1">Fixação</label>
                                  <input type="text" className="w-full text-xs px-2 py-1 border border-gray-200 rounded focus:border-[#cfa858] outline-none bg-white" placeholder="Ex: Intensa (8h+)" defaultValue={prod.fixacao || ''} onBlur={e => handleUpdate(prod.id, { fixacao: e.target.value })} />
                               </div>
                               <div>
                                  <label className="block text-[9px] uppercase tracking-wider text-gray-500 mb-1">Projeção</label>
                                  <input type="text" className="w-full text-xs px-2 py-1 border border-gray-200 rounded focus:border-[#cfa858] outline-none bg-white" placeholder="Ex: Alta" defaultValue={prod.projecao || ''} onBlur={e => handleUpdate(prod.id, { projecao: e.target.value })} />
                               </div>
                            </div>
                          </details>
                        </div>
                      </div>
                    </td>

                    {/* Dados Fornecedor */}
                    <td className="py-4 px-6">
                      <div className="flex items-baseline gap-2 mb-1">
                         <span className="text-gray-500 text-xs">Custo:</span>
                         <span className="font-semibold text-gray-700">R$ {prod.preco_custo.toFixed(2).replace('.', ',')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className={`w-2 h-2 rounded-full ${prod.estoque > 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                         <span className="text-xs text-gray-500">Estoque: {prod.estoque} uni.</span>
                      </div>
                    </td>

                    {/* Margem e Preço Venda */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs shadow-sm pl-2">R$</span>
                        <input
                           type="number"
                           step="0.01"
                           className="w-24 px-2 py-1.5 border border-gray-300 rounded font-medium text-gray-900 outline-none focus:ring-2 focus:ring-[#cfa858] focus:border-transparent text-sm transition-all shadow-inner"
                           value={prod.preco_venda}
                           onChange={e => handleUpdate(prod.id, { preco_venda: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </td>

                    {/* Toggle Website Visibility */}
                    <td className="py-4 px-6 text-center">
                      <label className="flex items-center justify-center cursor-pointer group">
                        <input
                          type="checkbox"
                          className="sr-only switch-input"
                          checked={prod.publicar_no_site}
                          onChange={(e) => handleUpdate(prod.id, { publicar_no_site: e.target.checked })}
                        />
                        <div className="w-10 h-5 bg-gray-200 rounded-full transition relative group-hover:bg-gray-300">
                           <div className="w-4 h-4 bg-white rounded-full absolute top-[2px] left-[2px] shadow-sm transform transition"></div>
                        </div>
                      </label>
                      <span className={`text-[10px] font-medium tracking-wide mt-1.5 block ${prod.publicar_no_site ? 'text-[#b89142]' : 'text-gray-400'}`}>
                        {prod.publicar_no_site ? 'ATIVO' : 'OCULTO'}
                      </span>
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
