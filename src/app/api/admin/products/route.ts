import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, preco_venda, publicar_no_site, nome, classificacao, notas_olfativas, familia_olfativa, projecao, fixacao, ocasiao } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(preco_venda !== undefined && { preco_venda: parseFloat(preco_venda) }),
        ...(publicar_no_site !== undefined && { publicar_no_site: Boolean(publicar_no_site) }),
        ...(nome !== undefined && { nome: String(nome) }),
        ...(classificacao !== undefined && { classificacao: String(classificacao) }),
        ...(notas_olfativas !== undefined && { notas_olfativas: notas_olfativas ? String(notas_olfativas) : null }),
        ...(familia_olfativa !== undefined && { familia_olfativa: familia_olfativa ? String(familia_olfativa) : null }),
        ...(projecao !== undefined && { projecao: projecao ? String(projecao) : null }),
        ...(fixacao !== undefined && { fixacao: fixacao ? String(fixacao) : null }),
        ...(ocasiao !== undefined && { ocasiao: ocasiao ? String(ocasiao) : null }),
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
