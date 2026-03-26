# qistemplates

A monorepo for storing project templates and the CLI used to create them.

## Workspace layout

- `packages/cli`: npm-published CLI package
- `packages/core`: shared template creation logic
- `templates`: project templates stored in-repo

## Development

```bash
bun install
bun run dev --help
bun run build
bun run lint
bun run typecheck
```

The workspace is orchestrated with Turborepo. Build outputs are cached per package, and
`@qitemplates/cli` will automatically wait for `@qitemplates/core` to finish building first.

## Release

Use Changesets to version the workspace packages, then publish the CLI package to npm.

## Publishing

The release flow is automated with GitHub Actions and Changesets.

- `.github/workflows/ci.yml` validates lint, typecheck, and build on pull requests and `main`
- `.github/workflows/release.yml` creates or updates a Changesets release PR on `main`
- When that PR is merged and `NPM_TOKEN` is configured, Changesets publishes `@qitemplates/core` and `@qitemplates/cli` to npm

Required repository secrets:

- `NPM_TOKEN`: npm access token with publish permission for the `@qitemplates` scope
