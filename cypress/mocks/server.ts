import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * MSW server for Node.js (unit tests, integration tests).
 * Use in test setup: server.listen()
 */
export let server = setupServer(...handlers);
