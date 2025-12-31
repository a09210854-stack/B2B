const { describe, it, test, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');

const vi = {
  spyOn: (...args) => jest.spyOn(...args),
  fn: (...args) => jest.fn(...args),
  mock: (moduleName, factory) => jest.mock(moduleName, factory),
  clearAllMocks: () => jest.clearAllMocks(),
  resetAllMocks: () => jest.resetAllMocks(),
  restoreAllMocks: () => (jest.restoreAllMocks ? jest.restoreAllMocks() : undefined),
  // convenience: allow setting mock data on global prisma
  setMockUserData: (data) => {
    if (global && global.prisma && typeof global.prisma.__reset === 'function') {
      global.prisma.__reset({ user: data });
    }
  }
};

module.exports = { describe, it, test, expect, beforeAll, afterAll, beforeEach, afterEach, vi };
