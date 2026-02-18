import type {IProductData} from "~/types/product";

export interface INewClaim {
    orderItems: INewClaimOrderItem[];
    customers: INewClaimCustomer[];
    organisationUnit: INewClaimOrganisationUnit;
    principal: IProductData;
    createdBy: INewClaimCreatedBy;
}

export interface INewClaimOrderItem {
    description: string;            // backend expects this (can be "")
    itemQuantity: number;           // quantity
    itemPrice: number;              // price in øre
    itemCode: string;
    originalItemPrice: number;      // price in øre
    taxrate: number | null;         // NOTE: lowercase
    originalDescription: string;    // display text
    itemUri: string;
}

export interface INewClaimCustomer {
    id: string;
    name: string;
}

export interface INewClaimOrganisationUnit {
    name: string;
    organisationNumber: string;
}


export interface INewClaimCreatedBy {
    name: string;
    employeeNumber: string;
    organisation: INewClaimOrganisation;
    organisationUnits: INewClaimOrganisationUnit[];
    idleTime: number;
    admin: boolean;
}

export interface INewClaimOrganisation {
    organisationNumber: string;
    name: string;
}
