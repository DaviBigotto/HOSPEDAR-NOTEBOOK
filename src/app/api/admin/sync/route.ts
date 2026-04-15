import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Bypass SSL certificate errors from Vendizap in dev
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Allow 5 minutes for this request to complete (it's a heavy scraper)
export const maxDuration = 300; 
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: Request) {
  try {
    const productMap = new Map<string, any>();
    let page = 0;
    
    const targetCategories = [
        "66a29d6d82566b4ded35b45b", // TESTER ORIGINAL PERFUME
        "633e196a4bbfb153452e5c63", // Victoria’s Secret 100% original
        "64e9590eae1ccc0f6165d084", // PERFUME ORIGINAL 100%
        "64d5583b95f5fa75b4326b2c", // PERFUME ÁRABE ORIGINAL
        "6600b730f538e441e71a5977", // Bath & body works hidratante
        "633e18ca7042d14a8703d251"  // Hidratante dreambrandcollection
    ];
    
    console.log("Starting Sync with Target Categories:", targetCategories);
    
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
            "paginaPromocoes": page
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
        
        if (!res.ok) {
            console.error(`HTTP error! status: ${res.status}`);
            break;
        }

        const data = await res.json();
        const lists = data.listas || {};
        
        const gallery = lists.listaGaleria || [];
        const highlights = lists.listaDestaques || [];
        const promos = lists.listaPromocoes || [];

        const combined = [...gallery, ...highlights, ...promos];
        
        // If the gallery (main pagination) is empty, we've likely hit the end
        if (gallery.length === 0 && page > 0) {
            console.log(`Gallery empty at page ${page}. Finalizing collection.`);
            break;
        }

        console.log(`Page ${page}: Gallery=${gallery.length}, Highlights=${highlights.length}, Promos=${promos.length}`);

        combined.forEach(p => {
            // Handle both possible _id formats (object with $oid or raw string)
            const id = typeof p._id === 'string' ? p._id : p._id?.$oid;
            if (id) {
                productMap.set(id, p);
            }
        });
        
        page++;
        if (page > 100) break;
    }
    
    console.log(`Total unique products collected: ${productMap.size}`);
    
    const allProducts = Array.from(productMap.values());
    const filtered = allProducts.filter(p => {
        return p.categorias?.some((c: any) => {
            const catId = typeof c === 'string' ? c : c.$oid;
            return targetCategories.includes(catId);
        });
    });

    console.log(`Filtered products count: ${filtered.length}`);

    let syncedCount = 0;
    for (const prod of filtered) {
        const externalId = typeof prod._id === 'string' ? prod._id : prod._id?.$oid;
        const nome = prod.nome || prod.descricao; // Support both naming fields
        
        const categoriaObj = prod.categorias?.find((c: any) => {
            const catId = typeof c === 'string' ? c : c.$oid;
            return targetCategories.includes(catId);
        });
        const catId = typeof categoriaObj === 'string' ? categoriaObj : categoriaObj?.$oid;
        
        let catName = 'Importados';
        if (catId === '66a29d6d82566b4ded35b45b') catName = 'Tester';
        if (catId === '633e196a4bbfb153452e5c63') catName = 'Victoria Secret';
        if (catId === '64d5583b95f5fa75b4326b2c') catName = 'Árables';
        if (catId === '6600b730f538e441e71a5977' || catId === '633e18ca7042d14a8703d251') catName = 'Cremes';

        const imagem_url = prod.imagemUrl || (prod.imagens && prod.imagens[0]?.link) || prod.imagens?.[0]?.linkOriginal || null;
        const preco_custo = prod.variacoes?.[0]?.preco || prod.preco || 0;
        const estoqueData = prod.estoque?._produto !== undefined ? prod.estoque._produto : (prod.variacoes?.[0]?.estoque || prod.estoque || 0);
        const disponivel = estoqueData > 0 && !prod.esgotado;

        await prisma.product.upsert({
            where: { external_id: externalId },
            update: {
                nome,
                categoria: catName,
                imagem_url,
                preco_custo,
                estoque: Number(estoqueData) || 0,
                disponivel: !!disponivel,
                updated_at: new Date()
            },
            create: {
                external_id: externalId,
                nome,
                categoria: catName,
                imagem_url,
                preco_custo,
                preco_venda: 0, 
                estoque: Number(estoqueData) || 0,
                disponivel: !!disponivel,
                publicar_no_site: false 
            }
        });
        syncedCount++;
    }
    
    return NextResponse.json({ 
        success: true, 
        message: `Sincronização completa concluída! ${syncedCount} produtos processados.` 
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("Sync Error: ", error);
    return NextResponse.json({ error: 'Internal Server Error during Sync' }, { status: 500, headers: corsHeaders });
  }
}
