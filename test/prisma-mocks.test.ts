import { describe, it, expect, beforeEach } from 'vitest';
import { prisma } from '../lib/prisma';

beforeEach(() => {
  // reset all mock data
  (global as any).__resetPrisma({ user: [], order: [], payment: [] });
});

describe('prisma mock basic flows', () => {
  it('can create and find user', async () => {
    await prisma.user.create({ data: { id: 'u1', role: 'seller' } });
    const u = await prisma.user.findUnique({ where: { id: 'u1' } });
    expect(u).toBeTruthy();
    expect(u?.role).toBe('seller');
  });

  it('can create order for user and query by userId', async () => {
    await prisma.user.create({ data: { id: 'u2', role: 'buyer' } });
    await prisma.order.create({ data: { id: 'o1', userId: 'u2', amount: 100 } });
    const orders = await prisma.order.findMany({ where: { userId: 'u2' } });
    expect(orders).toHaveLength(1);
    expect(orders[0].amount).toBe(100);
  });

  it('can create payment for order and find it', async () => {
    await prisma.order.create({ data: { id: 'o2', userId: 'u2', amount: 10 } });
    await prisma.payment.create({ data: { id: 'p1', orderId: 'o2', status: 'succeeded' } });
    const payments = await prisma.payment.findMany({ where: { orderId: 'o2' } });
    expect(payments[0].status).toBe('succeeded');
  });
});
