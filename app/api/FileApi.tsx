import { type ApiResponse } from "novari-frontend-components";
import type { IClaim } from "~/types/claim";
import { createApiManager } from "~/api/apiBaseUrl";

class FileApi {
  static async sendFile(
    schoolOrgId: string,
    file: File,
  ): Promise<ApiResponse<IClaim[]>> {
    const endpoint = "/api/file";
    const functionName = "sendFile";

    const formData = new FormData();
    formData.append("file", file);

    return await createApiManager().call<IClaim[]>({
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
