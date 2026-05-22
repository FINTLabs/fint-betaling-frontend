import type {IOrganisationUnit} from "~/types/user";

export interface ILineItem {
  description: string;
  itemQuantity: number;
  itemPrice: number; // Price in øre
  itemCode: string;
  originalItemPrice: number; // Price in øre
  taxRate: number | null;
  originalDescription: string;
}

export interface IClaim {
  orgId: string;
  orderNumber: number;
  createdDate: string; // ISO 8601 date string
  invoiceDate: string | null; // ISO 8601 date string
  paymentDueDate: string | null; // ISO 8601 date string
  amountDue: number; // Amount in øre
  originalAmountDue: number; // Amount in øre
  requestedNumberOfDaysToPaymentDeadline: number | null;
  customerName: string;
  createdByEmployee: string;
  organisationUnit: IOrganisationUnit;
  principalCode: string;
  invoiceUri: string;
  orderItems: ILineItem[];
  claimStatus: string;
  statusMessage: string;
  timestamp: number;
  invoiceNumbers: string[];
}

