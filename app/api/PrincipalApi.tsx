import { type ApiResponse } from "novari-frontend-components";
import type { IClassGroup } from "~/types/group";
import { createApiManager } from "~/api/apiBaseUrl";

class PrincipalApi {
  static async getPrincipals(
    selectedOrg: string,
  ): Promise<ApiResponse<IClassGroup[]>> {
    const functionName = "getPrincipals";
    return await createApiManager().call<IClassGroup[]>({
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
