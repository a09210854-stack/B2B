import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAuth, requireRole } from '../lib/rbac';
import * as auth from '../lib/auth';
import { HttpError } from '../lib/httpError';

beforeEach(() => {
  vi.restoreAllMocks();
  // reset the in-memory prisma mock before each test
  (global as any).__resetPrisma({ user: [] });
});

describe('rbac helpers', () => {
  it('throws Unauthorized when no user', async () => {
    // no Authorization header -> unauthorized
    const req = new Request('http://localhost');
    await expect(requireAuth(req)).rejects.toBeInstanceOf(HttpError);
    await expect(requireAuth(req)).rejects.toMatchObject({ status: 401 });
  });

  it('throws Forbidden when role mismatch', async () => {
    // seed a buyer user
    (global as any).__resetPrisma({ user: [{ id: 'u1', role: 'buyer' }] });
    const token = auth.signJwt('u1');
    const req = new Request('http://localhost', { headers: { authorization: `Bearer ${token}` } });
    await expect(requireRole(req, ['seller'])).rejects.toBeInstanceOf(HttpError);
    await expect(requireRole(req, ['seller'])).rejects.toMatchObject({ status: 403 });
  });

  it('returns user when role matches', async () => {
    // seed a seller user
    (global as any).__resetPrisma({ user: [{ id: 'u1', role: 'seller' }] });
    const token = auth.signJwt('u1');
    const req = new Request('http://localhost', { headers: { authorization: `Bearer ${token}` } });
    const u = await requireRole(req, ['seller']);
    expect(u?.id).toBe('u1');
    expect(u?.role).toBe('seller');
  });
});
