import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * MSW worker for browser (component tests, dev with mocked API).
 * Use in app entry or test setup: worker.start()
 */
export const worker = setupWorker(...handlers);
