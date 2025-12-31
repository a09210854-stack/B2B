const { PrismaClient } = require('./prisma-shim');
// initialize a singleton global prisma for tests to reuse
global.prisma = global.prisma || new PrismaClient();
// export helper to reset mock data from tests
global.__resetPrisma = (data) => {
  if (global.prisma && typeof global.prisma.__reset === 'function') global.prisma.__reset(data);
};
