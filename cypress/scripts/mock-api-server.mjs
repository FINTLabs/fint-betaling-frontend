#!/usr/bin/env node
/**
 * Mock API server for E2E tests.
 * Serves static fixture files to simulate the backend API.
 * Run with: node scripts/mock-api-server.mjs
 */

import { createServer } from "http";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, "..", "cypress", "fixtures");

const PORT = 3099;

const routes = {
  "/api/me": "me.json",
  "/api/claim/count/by-status/STORED": "count-stored.json",
  "/api/claim/count/by-status/SEND_ERROR": "count-send-error.json",
  "/api/claim/count/by-status/ACCEPT_ERROR": "count-accept-error.json",
  "/api/claim/count/by-status/UPDATE_ERROR": "count-update-error.json",
  "/api/claim/count/by-status/ERROR": "count-error.json",
  "/api/group/basis-group": "basis-groups.json",
  "/api/group/teaching-group": "teaching-groups.json",
  "/api/group/school": "school.json",
  "/api/principal": "principals.json",
};

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // POST /api/events - analytics (returns 200)
  if (req.method === "POST" && pathname === "/api/events") {
    req.on("data", () => {});
    req.on("end", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  // GET /api/claim - return claims, use claims-stored when status=STORED
  if (req.method === "GET" && pathname === "/api/claim") {
    const status = url.searchParams.get("status");
    const fixture = status === "STORED" ? "claims-stored.json" : "claims.json";
    try {
      const data = readFileSync(join(FIXTURES_DIR, fixture), "utf-8");
      const parsed = JSON.parse(data);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(parsed));
      return;
    } catch (err) {
      console.error(`Error reading ${fixture}:`, err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Internal server error" }));
      return;
    }
  }

  // POST /api/claim - create claim
  if (req.method === "POST" && pathname === "/api/claim") {
    req.on("data", () => {});
    req.on("end", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify([{ orderNumber: 3001, claimStatus: "STORED" }]));
    });
    return;
  }

  // POST /api/claim/send - send claims to factoring
  if (req.method === "POST" && pathname === "/api/claim/send") {
    req.on("data", () => {});
    req.on("end", () => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify([{ orderNumber: 2001, claimStatus: "SENT" }]));
    });
    return;
  }

  // DELETE /api/claim/order-number/:id - cancel claim
  const cancelMatch = pathname.match(/^\/api\/claim\/order-number\/(.+)$/);
  if (req.method === "DELETE" && cancelMatch) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ orderNumber: cancelMatch[1], claimStatus: "CANCELLED" }));
    return;
  }

  // Match count by status: /api/claim/count/by-status/:status?query
  const countMatch = pathname.match(/^\/api\/claim\/count\/by-status\/(\w+)/);
  if (countMatch) {
    const status = countMatch[1];
    const fixtureMap = {
      STORED: "count-stored.json",
      SEND_ERROR: "count-send-error.json",
      ACCEPT_ERROR: "count-accept-error.json",
      UPDATE_ERROR: "count-update-error.json",
      ERROR: "count-error.json",
    };
    const fixture = fixtureMap[status];
    if (fixture) {
      try {
        const data = readFileSync(join(FIXTURES_DIR, fixture), "utf-8");
        const parsed = JSON.parse(data);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(parsed));
        return;
      } catch (err) {
        console.error(`Error reading ${fixture}:`, err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Internal server error" }));
        return;
      }
    }
  }

  // Exact route match
  const fixture = routes[pathname];
  if (fixture) {
    try {
      const data = readFileSync(join(FIXTURES_DIR, fixture), "utf-8");
      const parsed = JSON.parse(data);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(parsed));
      return;
    } catch (err) {
      console.error(`Error reading ${fixture}:`, err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Internal server error" }));
      return;
    }
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`);
});
