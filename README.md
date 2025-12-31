# B2B

[![CI](https://github.com/a09210854-stack/B2B/actions/workflows/validate-migrate-tests.yml/badge.svg)](https://github.com/a09210854-stack/B2B/actions/workflows/validate-migrate-tests.yml)

A small SaaS backend with tests and developer tooling.

## Contributing

Please read our contribution guidelines: [`CONTRIBUTING.md`](./CONTRIBUTING.md)

## Usage example

Below is a short example showing how to seed the in-memory test DB and use `auth.signJwt` in tests to exercise protected helpers (same pattern we use in `test/rbac.test.ts`):

```ts
// example.test.ts
import { prisma } from './lib/prisma';
import * as auth from './lib/auth';
import { requireRole } from './lib/rbac';

beforeEach(() => {
  (global as any).__resetPrisma({ user: [{ id: 'u1', role: 'seller' }] });
});

it('example usage: seed, sign, and assert', async () => {
  const token = auth.signJwt('u1');
  const req = new Request('http://localhost', { headers: { authorization: `Bearer ${token}` } });
  const user = await requireRole(req, ['seller']);
  expect(user?.id).toBe('u1');
});
```

This shows the recommended pattern for tests: seed with `global.__resetPrisma(...)`, create a JWT with `auth.signJwt(...)`, then call your helpers or routes using a `Request` with an Authorization header.

## Development setup

1. Clone the repo:

```bash
git clone git@github.com:a09210854-stack/B2B.git
cd B2B
```

2. Install dependencies:

```bash
npm ci
```

3. Run tests locally:

```bash
npm test
```

4. If you modify tests, run the codemod to migrate old `getCurrentUser` spy patterns:

```bash
npm run migrate-tests
```

## Tech stack

- Node.js 20
- TypeScript
- Jest + ts-jest for tests
- Prisma (mocked in tests)
- Zod for validations

## Architecture overview

- `lib/` — core libraries (auth, rbac, prisma, validators, helpers).
- `app/` and `api/` — API route definitions (server framework agnostic; these are organized as route handlers).
- `prisma-shim.js` + `prisma-client.d.ts` — in-memory Prisma mock and types used for fast, reliable unit tests without the generated client or a DB.
- `test/` — project tests (uses the in-memory mocks and the pattern documented above).
- `.github/workflows/validate-migrate-tests.yml` — CI workflow that runs the codemod and tests and attempts to auto-commit fixes for same-repo PRs.

This layout keeps core logic in `lib/` and routes small and testable, with a focus on fast unit tests using the in-memory Prisma mock.
## Running tests

- Install dependencies: `npm ci`
- Run tests: `npm test`

For testing guidelines and the codemod that helps migrate tests, see `CONTRIBUTING.md`.