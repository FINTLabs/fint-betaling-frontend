import { type ApiResponse } from "novari-frontend-components";
import type { IClassGroup } from "~/types/group";
import { createApiManager } from "~/api/apiBaseUrl";

class SchoolGroupApi {
  static async getBasisGroups(
    selectedOrg: string,
  ): Promise<ApiResponse<IClassGroup[]>> {
    const functionName = "getSchoolGroups";

    return await createApiManager().call<IClassGroup[]>({
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

    return await createApiManager().call<IClassGroup[]>({
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

    return await createApiManager().call<IClassGroup[]>({
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
