export interface ILineItem {
  itemCode: string;
  itemPrice: number; // Price in øre (e.g., 64900 = 649.00)
  taxrate: number | null;
  description: string;
  uri: string;
}

export interface IProductData {
  code: string;
  description: string;
  lineItems: ILineItem[];
  uri: string;
  organisation: {
    organisationNumber: string;
    name: string;
  };
}

export interface ISelectedProduct extends ILineItem {
  quantity: number;
  freeText?: string;
  customPrice?: number; // Optional custom price override (in øre)
}
