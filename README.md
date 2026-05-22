# FINT Betaling – frontend

Web app for creating and managing payment orders in FINT Betaling.

## Requirements

- Node.js 22+
- npm

## Get started

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

The app talks to a backend API. Set the API URL if needed:

```bash
VITE_API_URL=https://your-api-url npm run dev
```

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
