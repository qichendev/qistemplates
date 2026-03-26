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
