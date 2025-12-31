# B2B

[![CI](https://github.com/a09210854-stack/B2B/actions/workflows/validate-migrate-tests.yml/badge.svg)](https://github.com/a09210854-stack/B2B/actions/workflows/validate-migrate-tests.yml)

A small SaaS backend with tests and developer tooling.

## Contributing

Please read our contribution guidelines: [`CONTRIBUTING.md`](./CONTRIBUTING.md)

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

## Running tests

- Install dependencies: `npm ci`
- Run tests: `npm test`

For testing guidelines and the codemod that helps migrate tests, see `CONTRIBUTING.md`.