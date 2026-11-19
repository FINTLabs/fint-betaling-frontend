# FINT Betaling – frontend

Web app for creating and managing payment orders in FINT Betaling.

## Requirements

- Node.js 22+
- npm

## Get started

```bash
npm install
```

Set `VITE_API_URL` to the backend base URL without a trailing slash or `/api`.
For a backend running locally with the default Spring configuration, use:

```bash
VITE_API_URL=http://localhost:8080 npm run dev
```

For a port forward to the FINTLabs beta backend on local port 8080, use:

```bash
VITE_API_URL=http://localhost:8080/fintlabs/beta npm run dev
```

Open [http://localhost:3001](http://localhost:3001). You can also set
`VITE_API_URL` in `.env` and run `npm run dev`. Restart an existing dev server
after changing the setting. A `401`
from the beta backend means it received the request and requires an authorized
FINT user token. The port forward connects directly to the pod and bypasses the
ingress that handles SSO.

## Production

```bash
npm run build
npm run start
```

The server listens on port **8000** by default (see `Dockerfile`).

## Docker

```bash
docker build -t fint-betaling-frontend .
docker run -p 8000:8000 fint-betaling-frontend
```

## Useful commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run test` | Unit tests |
| `npm run cypress` | End-to-end tests |
| `npm run lint` | Lint code |
| `npm run typecheck` | TypeScript check |

## Main pages

| Path | Purpose |
|------|---------|
| `/` | Dashboard |
| `/ny` | Create new order |
| `/send` | Pending orders |
| `/historikk` | Order history |
