const { PrismaClient: PrismaClientImpl } = require('../prisma-shim');
import { signJwt, getCurrentUser } from '../lib/auth';
import { requireRole } from '../lib/rbac';

// This script demonstrates how to seed the in-memory Prisma mock
// and exercise a protected helper using a signed JWT.

async function main() {
  // Create and attach a mock prisma instance (like tests do via jest.setup)
  const prisma = new PrismaClientImpl() as any;
  // attach our instance so other modules use the same in-memory store
  (global as any).prisma = prisma;

  // connect (no-op for the mock but kept for parity)
  await prisma.$connect();

  // seed a user on the instance that other modules use
  const existingPrisma = require('../lib/prisma').prisma;
  if (existingPrisma && typeof existingPrisma.__reset === 'function') {
    existingPrisma.__reset({ user: [{ id: 'u-example', role: 'seller' }] });
  } else if (typeof prisma.__reset === 'function') {
    prisma.__reset({ user: [{ id: 'u-example', role: 'seller' }] });
  } else {
    // fall back if not present
    (global as any).__resetPrisma?.({ user: [{ id: 'u-example', role: 'seller' }] });
  }

  // Create a JWT for that user
  const token = signJwt('u-example');

  // create a Request and call a helper that relies on getCurrentUser
  const req = new Request('http://localhost', { headers: { authorization: `Bearer ${token}` } });
  const maybeUser = await getCurrentUser(req);
  console.log('getCurrentUser returned:', maybeUser);
  const user = await requireRole(req, ['seller']);
  console.log('Example user returned by requireRole:', user);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
