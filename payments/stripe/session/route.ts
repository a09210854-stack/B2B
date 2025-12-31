import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { orderId } = await req.json();
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `Order ${order.id}` },
        unit_amount: Math.round(order.totalAmountUsd * 100),
      },
      quantity: 1,
    }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?status=paid`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?status=cancelled`,
    metadata: { orderId: order.id },
  });

  await prisma.payment.create({ data: { orderId: order.id, provider: 'stripe', sessionId: session.id, amountUsd: order.totalAmountUsd, currency: 'USD' } });

  return NextResponse.json({ url: session.url });
}
