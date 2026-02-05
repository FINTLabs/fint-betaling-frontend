import { NovariApiManager, type ApiResponse } from "novari-frontend-components";
import type { IOrder } from "~/types/order";

const API_URL = process.env.API_URL || "";
const apiManager = new NovariApiManager({
  baseUrl: API_URL,
});

class OrderApi {
  static async getOrders(
    selectedOrg: string,
    status?: string,
    period?: string,
    schoolSelection?: string,
  ): Promise<ApiResponse<IOrder[]>> {
    const functionName = "getOrders";

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

    return await apiManager.call<IOrder[]>({
      method: "GET",
      endpoint,
      functionName,
      customErrorMessage: "Kunne ikke hente ordrer.",
      customSuccessMessage: "Ordrer hentet.",
      additionalHeaders: {
        "x-school-org-id": selectedOrg,
      },
    });
  }

  static async sendOrders(orgId: string, orderList: IOrder[]) {
    return await apiManager.call<IOrder[]>({
      method: "POST",
      endpoint: `/api/claim`,
      functionName: "sendOrders",
      customErrorMessage: "Kunne ikke sende ordrer.",
      customSuccessMessage: "Ordrer sendt.",
      body: orderList,
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
}

export default OrderApi;
