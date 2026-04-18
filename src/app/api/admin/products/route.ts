import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(products, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, categoria, preco_custo, preco_venda, imagem_url, volumetria } = body;

    if (!nome || !categoria) {
      return NextResponse.json({ error: 'Nome and Categoria are required' }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        external_id: `MANUAL-${Date.now()}`,
        nome,
        categoria,
        preco_custo: parseFloat(preco_custo) || 0,
        preco_venda: parseFloat(preco_venda) || 0,
        imagem_url: imagem_url || null,
        volumetria: volumetria || null,
        origem: "MANUAL",
        publicar_no_site: false,
        disponivel: true
      }
    });

    return NextResponse.json(newProduct, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, preco_venda, publicar_no_site, nome, categoria, classificacao, notas_olfativas, familia_olfativa, projecao, fixacao, ocasiao, volumetria, imagem_url } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(preco_venda !== undefined && { preco_venda: parseFloat(preco_venda) }),
        ...(publicar_no_site !== undefined && { publicar_no_site: Boolean(publicar_no_site) }),
        ...(nome !== undefined && { nome: String(nome) }),
        ...(categoria !== undefined && { categoria: String(categoria) }),
        ...(classificacao !== undefined && { classificacao: String(classificacao) }),
        ...(notas_olfativas !== undefined && { notas_olfativas: notas_olfativas ? String(notas_olfativas) : null }),
        ...(familia_olfativa !== undefined && { familia_olfativa: familia_olfativa ? String(familia_olfativa) : null }),
        ...(projecao !== undefined && { projecao: projecao ? String(projecao) : null }),
        ...(fixacao !== undefined && { fixacao: fixacao ? String(fixacao) : null }),
        ...(ocasiao !== undefined && { ocasiao: ocasiao ? String(ocasiao) : null }),
        ...(volumetria !== undefined && { volumetria: volumetria ? String(volumetria) : null }),
        ...(imagem_url !== undefined && { imagem_url: imagem_url ? String(imagem_url) : null }),
      }
    });

    return NextResponse.json(updatedProduct, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500, headers: corsHeaders });
  }
}


