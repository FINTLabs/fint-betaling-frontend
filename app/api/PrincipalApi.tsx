import { NovariApiManager, type ApiResponse } from "novari-frontend-components";
import type { IClassGroup } from "~/types/group";

const API_URL = process.env.API_URL || "";
const logManager = new NovariApiManager({
  baseUrl: API_URL,
});

class PrincipalApi {
  static async getPrincipals(
    selectedOrg: string,
  ): Promise<ApiResponse<IClassGroup[]>> {
    const functionName = "getPrincipals";
    return await logManager.call<IClassGroup[]>({
      method: "GET",
      endpoint: `/api/principal`,
      functionName,
      customErrorMessage: "Kunne ikke hente principals.",
      customSuccessMessage: "Principals hentet.",
      additionalHeaders: {
        "x-school-org-id": selectedOrg,
      },
    });
  }
}

export default PrincipalApi;
