# TESTING (Quick Guide) ✅

This project uses Jest with `ts-jest` to run both JS and TS tests. For convenience and to avoid requiring generated Prisma artifacts or Vitest at runtime, the test environment includes lightweight mocks and helpers.

## Run tests

- Run all Jest tests:

```bash
npm test
```

- Run a single test file:

```bash
npx jest path/to/your.test.ts
```

- Run the example usage script (shows seeding + JWT example):

```bash
npm run example
```

## What I added (helpful files)

- `jest.config.js` — configured with `ts-jest`, setup file, and module mappings for shims.
- `jest.setup.js` — initializes `global.prisma` for tests and provides `global.__resetPrisma(data)` to seed/reset in-memory data.
- `prisma-shim.js` — in-memory mock of `@prisma/client` (supports `user.findUnique`, `create`, `update`, `delete`, `findFirst`, and `__reset`) and additional `order` and `payment` model helpers (simple `create`, `findUnique`, `findMany`).
- `vitest-shim.js` — maps `vitest` imports to Jest equivalents and exposes `vi.setMockUserData` helper.
- `prisma-client.d.ts`, `vitest.d.ts` — TypeScript declaration stubs for the shims (now include `Order` and `Payment`).

## Using the mocks in tests 💡

- Reset or seed the in-memory Prisma before each test:

```ts
// in a test file
beforeEach(() => {
  // seed users
  global.__resetPrisma({ user: [{ id: 'u1', role: 'seller' }] });
});
```

- Or use the Vitest-style `vi` helper (available via `import { vi } from 'vitest'`):

```ts
import { vi, beforeEach } from 'vitest';

beforeEach(() => {
  vi.setMockUserData([{ id: 'u1', role: 'seller' }]);
  vi.restoreAllMocks();
});
```

- For mocking functions you can still use `vi.spyOn(...)` which delegates to `jest.spyOn` under the hood.

## Notes & Tips

- The shims are intentionally lightweight and suitable for unit tests / MVP-level integration tests. If you need database-like behaviors (relations, transactions), consider replacing the shim with a more feature-rich test double or the real Prisma client with a test database.
- If you prefer to run tests using `vitest` instead of `jest`, we can add an alternative configuration and remove shims.
- Always run `npm test` before opening a PR to ensure tests pass.

---

If you'd like, I can also add a short example test that seeds data using the new helpers. Would you like that? (yes/no)

---

Codemod: converting tests that spy on `getCurrentUser`

To automatically convert tests that call `vi.spyOn(auth, 'getCurrentUser')` into the new seeding + JWT pattern, run:

```bash
npm run migrate-tests
```

The codemod is conservative and updates `test/**/*.test.ts` files; review changes and run `npm test` after conversion.

**CI check:** A GitHub Actions check runs `npm run migrate-tests` on every PR — if the codemod makes changes, the check will attempt to automatically commit the fixes back to your branch for PRs originating from this repository. If the PR is from a fork (where CI cannot push back), the check will fail and you must run `npm run migrate-tests` locally and commit the changes.

If the workflow auto-applies fixes, it will also post a short comment on the PR to notify you of the changes.

Example (before -> after):

Before (spy on `getCurrentUser`):

```ts
const fakeUser = { id: 'u1', role: 'seller' } as any;
vi.spyOn(auth, 'getCurrentUser').mockResolvedValue(fakeUser);
const req = new Request('http://localhost');
const u = await requireRole(req, ['seller']);
```

After (seed + JWT):

```ts
(global as any).__resetPrisma({ user: [{ id: 'u1', role: 'seller' }] });
const token = auth.signJwt('u1');
const req = new Request('http://localhost', { headers: { authorization: `Bearer ${token}` } });
const u = await requireRole(req, ['seller']);
```
