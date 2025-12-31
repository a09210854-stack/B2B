# Contributing

Thanks for helping improve this project! A few quick notes to make contributions smooth:

- Run tests locally before opening a PR:

```bash
npm ci
npm test
```

- If you modify tests or add new tests, run the codemod to update any tests that use the old `getCurrentUser` spy pattern:

```bash
npm run migrate-tests
```

- Our CI automatically runs `npm run migrate-tests` on PRs. If the codemod changes files:
  - For PRs from the same repository, CI will attempt to auto-commit the fixes back to your branch.
  - For PRs from forks, CI will post a comment with instructions and fail the check; please run `npm run migrate-tests` locally and commit the changes.

- If you need help or the automation doesn't work for your branch, open an issue or reply to the PR and we'll assist.

Thanks! 🎉