import {type ApiResponse, NovariApiManager} from "novari-frontend-components";
import type { IProductData } from "~/types/product";
import { getRequestCookieHeaders } from "~/utils/requestCookie.server";

const apiManager = new NovariApiManager({
  baseUrl: import.meta.env.VITE_API_URL ?? "",
});


class PrincipalApi {
  static async getPrincipals(
    request: Request,
    selectedOrg: string,
  ): Promise<ApiResponse<IProductData>> {
    const functionName = "getPrincipals";
    return await apiManager.call<IProductData>({
      method: "GET",
      endpoint: `/api/principal`,
      functionName,
      customErrorMessage: "Kunne ikke hente principals.",
      customSuccessMessage: "Principals hentet.",
      additionalHeaders: {
        ...getRequestCookieHeaders(request),
        "x-school-org-id": selectedOrg,
      },
    });
  }
}

export default PrincipalApi;
