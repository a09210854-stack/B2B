let PrismaClient: any;
try {
  // prefer the real client when available
  PrismaClient = require('@prisma/client').PrismaClient;
} catch (err) {
  // fall back to the in-repo shim during development/tests
  PrismaClient = require('../prisma-shim').PrismaClient;
}

declare global {
  // allow global prisma during development to avoid multiple instances
  var prisma: any | undefined;
}

export const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
