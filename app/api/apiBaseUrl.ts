import { NovariApiManager } from "novari-frontend-components";

let runtimeApiBaseUrl =
  import.meta.env.VITE_API_URL || process.env.VITE_API_URL || "";

export function setApiBaseUrlFromRequest(request: Request) {
  if (runtimeApiBaseUrl) {
    return;
  }

  try {
    runtimeApiBaseUrl = new URL(request.url).origin;
  } catch {
    runtimeApiBaseUrl = "";
  }
}

export function createApiManager() {
  return new NovariApiManager({
    baseUrl: runtimeApiBaseUrl,
  });
}
