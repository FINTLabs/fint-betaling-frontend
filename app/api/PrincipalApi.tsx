import {type ApiResponse, NovariApiManager} from "novari-frontend-components";
import type { IClassGroup } from "~/types/group";

const API_URL = import.meta.env.VITE_API_URL || process.env.VITE_API_URL || "";
const apiManager = new NovariApiManager({
  baseUrl: API_URL,
});

class PrincipalApi {
  static async getPrincipals(
    selectedOrg: string,
  ): Promise<ApiResponse<IClassGroup[]>> {
    const functionName = "getPrincipals";
    return await apiManager.call<IClassGroup[]>({
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
