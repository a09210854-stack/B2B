Thanks for the PR — a quick note from our automated checks:

It looks like our test migration codemod made changes to test files when run on your branch. Because your PR originates from a fork, CI cannot push changes back to your branch.

Please run the codemod locally and commit the results so the PR can pass checks:

```bash
# from project root
npm ci
npm run migrate-tests
# review changes
git add -A
git commit -m "chore(tests): apply codemod to update getCurrentUser spies"
git push
```

If you'd rather I open an automated fix PR for you, let me know and I can try to create one for your branch.

Helpful tips:
- The codemod targets `test/**/*.test.ts` and is conservative; inspect changes before committing.
- You can run `npx jest` or `npm test` locally after conversion to validate tests pass.

If you need help, reply here and I'll assist.