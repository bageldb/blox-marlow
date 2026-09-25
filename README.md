# Blox Marlow

A polished, general-purpose Blox website template. Page content and composition
come from Blox; this repository owns the renderer and its available blocks.

## Development

```bash
bun install
bun run dev
```

Set `VITE_BLOX_WEBSITE_NAME` and `VITE_BLOX_API_URL` for browser rendering.
Production builds additionally require `BLOX_API_URL`, `BLOX_WEBSITE_ID`, and
`BLOX_BUILD_TOKEN`.

Netlify deploys must use the repository's configured Git build.
