import { NovariApiManager, type ApiResponse } from "novari-frontend-components";
import type { IClassGroup } from "~/types/group";

const API_URL = import.meta.env.VITE_API_URL || "";
const logManager = new NovariApiManager({
  baseUrl: API_URL,
});

class SchoolGroupApi {
  static async getBasisGroups(
    selectedOrg: string,
  ): Promise<ApiResponse<IClassGroup[]>> {
    const functionName = "getSchoolGroups";

    return await logManager.call<IClassGroup[]>({
      method: "GET",
      endpoint: `/api/group/basis-group`,
      functionName,
      customErrorMessage: "Kunne ikke hente school groups.",
      customSuccessMessage: "School groups hentet.",
      additionalHeaders: {
        "x-school-org-id": selectedOrg,
      },
    });
  }

  static async getTeachingGroups(
    selectedOrg: string,
  ): Promise<ApiResponse<IClassGroup[]>> {
    const functionName = "getSchoolGroups";

    return await logManager.call<IClassGroup[]>({
      method: "GET",
      endpoint: `/api/group/teaching-group`,
      functionName,
      customErrorMessage: "Kunne ikke hente teaching groups.",
      customSuccessMessage: "Teaching groups hentet.",
      additionalHeaders: {
        "x-school-org-id": selectedOrg,
      },
    });
  }

  static async getSchool(
    selectedOrg: string,
  ): Promise<ApiResponse<IClassGroup[]>> {
    const functionName = "getSchoolGroups";

    return await logManager.call<IClassGroup[]>({
      method: "GET",
      endpoint: `/api/group/school`,
      functionName,
      customErrorMessage: "Kunne ikke hente schools.",
      customSuccessMessage: "School groups hentet.",
      additionalHeaders: {
        "x-school-org-id": selectedOrg,
      },
    });
  }
}

export default SchoolGroupApi;
