import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requireAuth, requireRole } from '../lib/rbac';
import * as auth from '../lib/auth';
import { HttpError } from '../lib/httpError';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('rbac helpers', () => {
  it('throws Unauthorized when no user', async () => {
    vi.spyOn(auth, 'getCurrentUser').mockResolvedValue(null as any);
    const req = new Request('http://localhost');
    await expect(requireAuth(req)).rejects.toBeInstanceOf(HttpError);
    await expect(requireAuth(req)).rejects.toMatchObject({ status: 401 });
  });

  it('throws Forbidden when role mismatch', async () => {
    const fakeUser = { id: 'u1', role: 'buyer' } as any;
    vi.spyOn(auth, 'getCurrentUser').mockResolvedValue(fakeUser);
    const req = new Request('http://localhost');
    await expect(requireRole(req, ['seller'])).rejects.toBeInstanceOf(HttpError);
    await expect(requireRole(req, ['seller'])).rejects.toMatchObject({ status: 403 });
  });

  it('returns user when role matches', async () => {
    const fakeUser = { id: 'u1', role: 'seller' } as any;
    vi.spyOn(auth, 'getCurrentUser').mockResolvedValue(fakeUser);
    const req = new Request('http://localhost');
    const u = await requireRole(req, ['seller']);
    expect(u).toBe(fakeUser);
  });
});
