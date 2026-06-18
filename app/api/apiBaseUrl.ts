import { NovariApiManager } from "novari-frontend-components";

const envApiBaseUrl =
  import.meta.env.VITE_API_URL || process.env.VITE_API_URL || "";

export function createApiManager(request?: Request) {
  let baseUrl = envApiBaseUrl;
  if (!baseUrl && request) {
    try {
      baseUrl = new URL(request.url).origin;
    } catch {
      baseUrl = "";
    }
  }
  return new NovariApiManager({ baseUrl });
}
