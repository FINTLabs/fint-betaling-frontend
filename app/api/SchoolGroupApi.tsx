import {type ApiResponse, NovariApiManager} from "novari-frontend-components";
import type { IClassGroup, ISchool } from "~/types/group";
import { getRequestCookieHeaders } from "~/utils/requestCookie.server";

const apiManager = new NovariApiManager({
  baseUrl: import.meta.env.VITE_API_URL ?? "",
});


class SchoolGroupApi {
  static async getBasisGroups(
    request: Request,
    selectedOrg: string,
  ): Promise<ApiResponse<IClassGroup[]>> {
    const functionName = "getSchoolGroups";

    return await apiManager.call<IClassGroup[]>({
      method: "GET",
      endpoint: `/api/group/basis-group`,
      functionName,
      customErrorMessage: "Kunne ikke hente school groups.",
      customSuccessMessage: "School groups hentet.",
      additionalHeaders: {
        ...getRequestCookieHeaders(request),
        "x-school-org-id": selectedOrg,
      },
    });
  }

  static async getTeachingGroups(
    request: Request,
    selectedOrg: string,
  ): Promise<ApiResponse<IClassGroup[]>> {
    const functionName = "getSchoolGroups";

    return await apiManager.call<IClassGroup[]>({
      method: "GET",
      endpoint: `/api/group/teaching-group`,
      functionName,
      customErrorMessage: "Kunne ikke hente teaching groups.",
      customSuccessMessage: "Teaching groups hentet.",
      additionalHeaders: {
        ...getRequestCookieHeaders(request),
        "x-school-org-id": selectedOrg,
      },
    });
  }

  static async getSchool(
    request: Request,
    selectedOrg: string,
  ): Promise<ApiResponse<ISchool>> {
    const functionName = "getSchoolGroups";

    return await apiManager.call<ISchool>({
      method: "GET",
      endpoint: `/api/group/school`,
      functionName,
      customErrorMessage: "Kunne ikke hente schools.",
      customSuccessMessage: "School groups hentet.",
      additionalHeaders: {
        ...getRequestCookieHeaders(request),
        "x-school-org-id": selectedOrg,
      },
    });
  }
}

export default SchoolGroupApi;
