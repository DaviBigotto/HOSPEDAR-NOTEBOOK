async function syncAll() {
    let allProducts = [];
    let page = 0;
    
    while (true) {
        const payload = {
            "idUsuario": "633e0f5ae20456715d1067a4",
            "textoPesquisa": "",
            "categoria": [],
            "filtrosVitrine": {
                "texto": "",
                "precoMin": 0,
                "precoMax": 0,
                "variacoes": []
            },
            "isTabela": true,
            "permiteCache": true,
            "tipoCache": "geral",
            "produtoURL": null,
            "isMobile": false,
            "paginaGerais": page,
            "paginaPromocoes": 0
        };

        const res = await fetch('https://app.vendizap.com/webservice/Vitrine/carregarVitrine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://brandcollectionfabricasp.vendizap.com',
                'Referer': 'https://brandcollectionfabricasp.vendizap.com/'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        const galeria = data.listas.listaGaleria || [];
        allProducts.push(...galeria);
        
        console.log(`Página ${page} retornou ${galeria.length} produtos.`);
        
        if (galeria.length === 0) break;
        page++;
        
        // Safety break
        if (page > 50) break;
    }
    
    console.log(`Total de produtos extraídos: ${allProducts.length}`);
    
    // Filter
    const targetCategories = [
        "66a29d6d82566b4ded35b45b", // TESTER ORIGINAL PERFUME
        "633e196a4bbfb153452e5c63", // Victoria’s Secret 100% original
        "64e9590eae1ccc0f6165d084", // PERFUME ORIGINAL 100%
        "64d5583b95f5fa75b4326b2c"  // PERFUME ÁRABE ORIGINAL (Wait, user just said "perfumes importados"? Let me check instructions)
    ];
    
    const filtered = allProducts.filter(p => {
        return p.categorias?.some(c => targetCategories.includes(c.$oid));
    });
    
    console.log(`Produtos nas categorias alvo: ${filtered.length}`);
}

syncAll();
