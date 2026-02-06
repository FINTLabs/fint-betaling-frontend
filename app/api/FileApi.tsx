import { NovariApiManager, type ApiResponse } from "novari-frontend-components";
import type { IOrder } from "~/types/order";

const API_URL = import.meta.env.VITE_API_URL || "";
// const API_URL = "http://localhost:8080";

const apiManager = new NovariApiManager({
  baseUrl: API_URL,
});

class FileApi {
  static async sendFile(
    schoolOrgId: string,
    file: File,
  ): Promise<ApiResponse<IOrder[]>> {
    const endpoint = "/api/file";
    const functionName = "sendFile";

    const formData = new FormData();
    formData.append("file", file);

    return await apiManager.call<IOrder[]>({
      method: "POST",
      endpoint,
      functionName,
      body: formData,
      customErrorMessage: "Kunne ikke sende fil.",
      customSuccessMessage: "Fil sendt.",
      additionalHeaders: {
        "x-school-org-id": schoolOrgId,
      },
    });
  }
}

export default FileApi;
