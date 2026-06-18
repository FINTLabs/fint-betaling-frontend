import { NovariApiManager } from "novari-frontend-components";

let runtimeApiBaseUrl =
  import.meta.env.VITE_API_URL || process.env.VITE_API_URL || "";

let apiManager: NovariApiManager | null = null;

export function setApiBaseUrlFromRequest(request: Request) {
  if (runtimeApiBaseUrl) {
    return;
  }

  try {
    runtimeApiBaseUrl = new URL(request.url).origin;
  } catch {
    runtimeApiBaseUrl = "";
  } finally {
    apiManager = null;
  }
}

export function createApiManager() {
  if (!apiManager) {
    apiManager = new NovariApiManager({
      baseUrl: runtimeApiBaseUrl,
    });
  }
  return apiManager;
}
