import { setupServer } from "msw/node";
import { handlers } from "./all-handlers";

/**
 * MSW server for Node.js (unit tests, integration tests).
 * Use in test setup: server.listen()
 */
export const server = setupServer(...handlers);
