import { type ApiResponse, NovariApiManager } from "novari-frontend-components";
import type { IClaim } from "~/types/claim";
import type { IClassGroup, ICustomer } from "~/types/group";
import type { ISelectedProduct } from "~/types/product";
import type { IOrganisationUnit, IUser } from "~/types/user";

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

  static async sendClaims(
    customers: ICustomer[],
    orderItems: ISelectedProduct[],
    organisationUnit: IOrganisationUnit,
    principal: IClassGroup,
    createdBy: IUser,
  ): Promise<ApiResponse<IClaim[]>> {
    const functionName = "sendClaims";

    console.log(
      "sendClaims",
      customers,
      orderItems,
      organisationUnit,
      principal,
      createdBy,
    );
    // Transform selected products to order items format
    // const requestBody = {
    //   orgId: "fake.fintlabs.no",
    //   customers: customers,
    //   orderItems: transformedOrderItems,
    //   organisationUnit: organisationUnit,
    //   principal: principal,
    //   createdBy: {
    //     name: createdBy.name,
    //     employeeNumber: createdBy.employeeNumber,
    //     organisation: createdBy.organisation,
    //   },
    // };

    // return await apiManager.call<IOrder[]>({
    //   method: "POST",
    //   endpoint: `/api/claim`,
    //   functionName,
    //   customErrorMessage: "Kunne ikke opprette ordrer.",
    //   customSuccessMessage: "Ordrer opprettet.",
    //   body: requestBody,
    //   additionalHeaders: {
    //     "x-org-id": "fake.fintlabs.no",
    //   },
    // });
    return {
      success: true,
      data: [],
      message: "Ordrer test.",
      variant: "warning",
    };
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

  static async setPayment(
    orgId: string,
    customers: ICustomer[],
    orderItems: ISelectedProduct[],
    organisationUnit: IOrganisationUnit,
    principal: IClassGroup,
    createdBy: IUser,
  ): Promise<ApiResponse<IClaim[]>> {
    const functionName = "setPayment";
    //TODO: what should the selected products vs principal look like?

    // // Transform selected products to order items format matching the old structure
    // const transformedOrderItems = orderItems.map((product) => ({
    //   description: product.description,
    //   itemQuantity: product.quantity,
    //   itemPrice:
    //     product.customPrice !== undefined
    //       ? product.customPrice
    //       : product.itemPrice,
    //   itemCode: product.itemCode,
    //   originalItemPrice: product.itemPrice,
    //   taxrate: product.taxrate ?? null,
    //   originalDescription: product.description,
    //   itemUri: product.uri,
    //   freeText: product.freeText,
    // }));

    const requestBody = {
      orderItems: orderItems,
      customers: customers,
      organisationUnit: organisationUnit,
      principal: principal,
      createdBy: {
        name: createdBy.name,
        employeeNumber: createdBy.employeeNumber,
        organisation: createdBy.organisation,
      },
    };

    console.log("requestBody: ", requestBody);
    return await apiManager.call<IClaim[]>({
      method: "POST",
      endpoint: `/api/claim`,
      functionName,
      customErrorMessage: "Kunne ikke sette betaling.",
      customSuccessMessage: "Betaling satt.",
      body: requestBody,
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

  // static async cancelClaims(
  //   selectedOrg: string,
  //   claimIds: string[],
  // ): Promise<NovariSnackbarItem[]> {
  //   const functionName = "cancelPayments";
  //   const baseEndpoint = `/api/claim/order-number`;
  //
  //   const returnValues = [];
  //
  //   for (const claimId of claimIds) {
  //     const endpoint = `${baseEndpoint}/${claimId}`;
  //     const response = await apiManager.call<IClaim>({
  //       method: "DELETE",
  //       endpoint,
  //       functionName: `${functionName}_${claimId}`,
  //       customErrorMessage: `Kunne ikke kansellere ordre ${claimId}.`,
  //       customSuccessMessage: `Ordre ${claimId} kansellert.`,
  //       additionalHeaders: {
  //         "x-school-org-id": selectedOrg,
  //       },
  //     });
  //
  //     returnValues.push(response.status, claimId);
  //   }
  //
  //   return {
  //     returnValues,
  //   };
  // }

  static async updateClaimStatus(
    periodSelection: any,
    schoolSelection: any,
    selectedOrg: string,
  ) {
    console.log("updateClaimStatus", periodSelection, schoolSelection);

    return await apiManager.call<IClaim[]>({
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
