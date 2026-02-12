export interface INewClaim {
  orderItems: INewOrderItem[];
  customers: INewClaimCustomer[];
  organisationUnit: NewClaimOrganisationUnit;
  // principal: Principal;
  // createdBy: CreatedBy;
}

export interface INewOrderItem {
  description: string;
  itemQuantity: number;
  itemPrice: number;
  itemCode: string;
  originalItemPrice: number;
  taxrate: number | null;
  originalDescription: string;
  itemUri: string;
}

export interface INewClaimCustomer {
  id: string;
  name: string;
}

export interface NewClaimOrganisationUnit {
  name: string;
  organisationNumber: string;
}

// export interface NewClaimPrincipal {
//   code: string;
//   description: string;
//   lineitems: LineItem[];
//   uri: string;
//   organisation: Organisation;
// }
//
// export interface NewClaimLineItem {
//   itemCode: string;
//   itemPrice: number;
//   taxrate: number | null;
//   description: string;
//   uri: string;
// }
//
// export interface NewClaimOrganisation {
//   organisationNumber: string;
//   name: string;
// }
//
// export interface CreatedBy {
//   name: string;
//   employeeNumber: string;
//   organisation: Organisation;
//   organisationUnits: OrganisationUnit[];
//   idleTime: number;
//   admin: boolean;
// }
