declare module 'vitest' {
  import type { Expect } from '@jest/types/build/CustomMatchers';
  export const describe: any;
  export const it: any;
  export const test: any;
  export const expect: any;
  export const vi: {
    spyOn: any;
    fn: any;
    mock: any;
    restoreAllMocks: any;
    setMockUserData?: (data: any[]) => void;
  };
  export const beforeEach: any;
  export const afterEach: any;
  export const beforeAll: any;
  export const afterAll: any;
  export default any;
}
