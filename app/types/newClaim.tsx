import type { IUser } from "~/types/user";

export interface INewClaim {
  orderItems: IOrderItem[];
  customers: ICustomer[];
  organisationUnit: IOrganisationUnit;
  principal: [];
  createdBy: IUser;
}

export interface IOrderItem {
  description: string;
  itemQuantity: number;
  itemPrice: number;
  itemCode: string;
  originalItemPrice: number;
  taxrate: number | null;
  originalDescription: string;
  itemUri: string;
}

export interface ICustomer {
  id: string;
  name: string;
}

export interface IOrganisationUnit {
  name: string;
  organisationNumber: string;
}

// export interface IPrincipal {
//   code: string;
//   description: string;
//   lineitems: IPrincipalLineItem[];
//   uri: string;
//   organisation: IOrganisation;
// }
//
// export interface IPrincipalLineItem {
//   itemCode: string;
//   itemPrice: number;
//   taxrate: number | null;
//   description: string;
//   uri: string;
// }
