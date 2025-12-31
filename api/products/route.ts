import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { requireRole } from '../../../lib/rbac';
import { createProductSchema, CreateProductInput } from '../../../lib/validators';
import { HttpError } from '../../../lib/httpError';

export async function POST(req: Request) {
  try {
    const user = await requireRole(req, ['seller']);
    const body = await req.json();
    const parsed = createProductSchema.parse(body) as CreateProductInput;

    const p = await prisma.product.create({
      data: {
        ...parsed,
        sellerId: user.id,
      },
    });

    return NextResponse.json({ product: p }, { status: 201 });
  } catch (err: any) {
    if (err instanceof HttpError) return NextResponse.json({ error: err.message }, { status: err.status });
    if (err?.name === 'ZodError') return NextResponse.json({ error: err.format() }, { status: 422 });
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q');
  const hsCode = url.searchParams.get('hsCode');
  const category = url.searchParams.get('category');
  const sellerId = url.searchParams.get('sellerId');
  const page = parseInt(url.searchParams.get('page') || '1');
  const perPage = parseInt(url.searchParams.get('perPage') || '20');

  const where: any = {};
  if (q) where.OR = [{ title: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }];
  if (hsCode) where.hsCode = hsCode;
  if (category) where.category = category;
  if (sellerId) where.sellerId = sellerId;

  const [items, total] = await Promise.all([
    prisma.product.findMany({ where, skip: (page-1)*perPage, take: perPage, orderBy: { updatedAt: 'desc' } }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, perPage });
}
