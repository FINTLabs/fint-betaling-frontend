import type { IOrganisationUnit } from "~/types/user";

export interface ILineItem {
  id: number;
  description: string;
  itemQuantity: number;
  itemPrice: number; // Price in øre
  itemCode: string;
  originalItemPrice: number; // Price in øre
  taxRate: number | null;
  originalDescription: string;
  itemUri: string;
}

export interface IClaim {
  orgId: string;
  orderNumber: number;
  invoiceNumbersCommaSeperated: string | null;
  createdDate: string; // ISO 8601 date string
  lastModifiedDate: string; // ISO 8601 date string
  invoiceDate: string | null; // ISO 8601 date string
  paymentDueDate: string | null; // ISO 8601 date string
  amountDue: number | null; // Amount in øre
  originalAmountDue: number; // Amount in øre
  requestedNumberOfDaysToPaymentDeadline: number | null;
  customerId: string;
  customerName: string;
  createdByEmployeeNumber: string;
  organisationUnit: IOrganisationUnit;
  principalCode: string;
  principalUri: string;
  invoiceUri: string | null;
  orderItems: ILineItem[];
  claimStatus: string;
  statusMessage: string;
  timestamp: number;
  invoiceNumbers: string[];
}
