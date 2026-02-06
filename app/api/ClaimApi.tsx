import { NovariApiManager, type ApiResponse } from "novari-frontend-components";
import type { IOrder } from "~/types/order";
import type { ICustomer } from "~/types/group";
import type { ISelectedProduct } from "~/types/product";
import type { IOrganisationUnit, IUser } from "~/types/user";
import type { IClassGroup } from "~/types/group";

const API_URL = import.meta.env.VITE_API_URL || "";
// const API_URL = "http://localhost:8080";
const apiManager = new NovariApiManager({
  baseUrl: API_URL,
});

class ClaimApi {
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

  static async sendOrders(
    customers: ICustomer[],
    orderItems: ISelectedProduct[],
    organisationUnit: IOrganisationUnit,
    principal: IClassGroup,
    createdBy: IUser,
  ): Promise<ApiResponse<IOrder[]>> {
    const functionName = "createOrders";

    // Transform selected products to order items format
    const transformedOrderItems = orderItems.map((product) => ({
      itemCode: product.itemCode,
      description: product.description,
      itemQuantity: product.quantity,
      itemPrice:
        product.customPrice !== undefined
          ? product.customPrice
          : product.itemPrice,
      taxRate: product.taxrate ?? null,
      freeText: product.freeText,
      itemUri: product.uri,
    }));

    const requestBody = {
      orgId: "fake.fintlabs.no",
      customers: customers,
      orderItems: transformedOrderItems,
      organisationUnit: organisationUnit,
      principal: principal,
      createdBy: {
        name: createdBy.name,
        employeeNumber: createdBy.employeeNumber,
        organisation: createdBy.organisation,
      },
    };

    return await apiManager.call<IOrder[]>({
      method: "POST",
      endpoint: `/api/claim`,
      functionName,
      customErrorMessage: "Kunne ikke opprette ordrer.",
      customSuccessMessage: "Ordrer opprettet.",
      body: requestBody,
      additionalHeaders: {
        "x-org-id": "fake.fintlabs.no",
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

  //TODO: Add this functionality (3)
  static async setPayment(
    orgId: string,
    customers: ICustomer[],
    orderItems: ISelectedProduct[],
    organisationUnit: IOrganisationUnit,
    principal: IClassGroup,
    createdBy: IUser,
  ) {
    console.log(
      "setPayment",
      orgId,
      customers,
      orderItems,
      organisationUnit,
      principal,
      createdBy,
    );
    return { success: true };
  }

  static async cancelPayments(orderNumbers: string[]) {
    console.log("cancelPayments", orderNumbers);
    return { success: true };
  }

  static async updateClaimStatus(
    periodSelection: any,
    schoolSelection: any,
    selectedOrg: string,
  ) {
    console.log("updateClaimStatus", periodSelection, schoolSelection);

    return await apiManager.call<IOrder[]>({
      method: "POST",
      endpoint: `/api/claim/update-status`,
      functionName: "updateClaimStatus",
      customErrorMessage: "Kunne ikke oppdatere ordrer.",
      customSuccessMessage: "Ordrer oppdatert.",
      body: {
        periodSelection: periodSelection,
        schoolSelection: schoolSelection,
      },
      additionalHeaders: {
        "x-school-org-id": selectedOrg,
      },
    });
  }
}

export default ClaimApi;
