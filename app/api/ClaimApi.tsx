import { type ApiResponse, NovariApiManager } from "novari-frontend-components";
import type { IClaim } from "~/types/claim";

const API_URL = import.meta.env.VITE_API_URL || "";
const apiManager = new NovariApiManager({
  baseUrl: API_URL,
});

class ClaimApi {
  static async getClaims(
    selectedOrg: string,
    status?: string,
    period?: string,
    schoolSelection?: string,
  ): Promise<ApiResponse<IClaim[]>> {
    const functionName = "getClaims";

    // Build endpoint with optional query parameters
    const params = new URLSearchParams();

    if (status) {
      params.append("status", status);
    }

    if (period) {
      params.append("periodSelection", period);
    }

    if (schoolSelection) {
      params.append("schoolSelection", schoolSelection);
    }

    const queryString = params.toString();
    const endpoint = `/api/claim${queryString ? `?${queryString}` : ""}`;

    return await apiManager.call<IClaim[]>({
      method: "GET",
      endpoint,
      functionName,
      customErrorMessage: "Kunne ikke hente claims.",
      customSuccessMessage: "Claims hentet.",
      additionalHeaders: {
        "x-school-org-id": selectedOrg,
      },
    });
  }

  static async sendClaimsToSystem(
    orgId: string,
    claims: string,
  ): Promise<ApiResponse<IClaim[]>> {
    const functionName = "sendClaimsToSystem";
    orgId = "fintlabs.no";

    console.log("sendClaims", orgId, claims);

    return await apiManager.call<IClaim[]>({
      method: "POST",
      endpoint: `/api/claim/send`,
      functionName,
      customErrorMessage: "Kunne ikke sende claims.",
      customSuccessMessage: "Ordrer sendt.",
      body: claims,
      additionalHeaders: {
        "x-org-id": orgId,
      },
    });
  }

  static async getCountByStatus(
    selectedOrg: string,
    status: string,
    period?: string,
    schoolSelection?: string,
  ): Promise<ApiResponse<number>> {
    const functionName = "getCountByStatus";

    // Build query parameters
    const params = new URLSearchParams();
    if (period) {
      params.append("periodSelection", period);
    }
    if (schoolSelection) {
      params.append("schoolSelection", schoolSelection);
    }

    const queryString = params.toString();
    const endpoint = `/api/claim/count/by-status/${status}${queryString ? `?${queryString}` : ""}`;

    return await apiManager.call<number>({
      method: "GET",
      endpoint,
      functionName,
      customErrorMessage: "Kunne ikke hente antall ordrer.",
      customSuccessMessage: "Antall ordrer hentet.",
      additionalHeaders: {
        "x-school-org-id": selectedOrg,
      },
    });
  }

  static async createClaim(
    orgId: string,
    claimBody: string,
  ): Promise<ApiResponse<IClaim[]>> {
    const functionName = "createClaim";
    orgId = "fake.fintlabs.no";

    console.log("claimBody: ", claimBody);
    return await apiManager.call<IClaim[]>({
      method: "POST",
      endpoint: `/api/claim`,
      functionName,
      customErrorMessage: "Kunne ikke lagre ordre.",
      customSuccessMessage: "Ordre lagret.",
      body: claimBody,
      additionalHeaders: {
        "x-school-org-id": orgId,
      },
    });
  }

  static async cancelClaim(
    selectedOrg: string,
    claimId: string,
  ): Promise<ApiResponse<IClaim>> {
    const functionName = "cancelClaim";
    const endpoint = `/api/claim/order-number/${claimId}`;
    return await apiManager.call<IClaim>({
      method: "DELETE",
      endpoint,
      functionName: `${functionName}_${claimId}`,
      customErrorMessage: `Kunne ikke kansellere ordre ${claimId}.`,
      customSuccessMessage: `Ordre ${claimId} kansellert.`,
      additionalHeaders: {
        "x-school-org-id": selectedOrg,
      },
    });
  }
}

export default ClaimApi;
