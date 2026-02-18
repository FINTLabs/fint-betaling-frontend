export type ICustomer = {
  id: string;
  name: string;
};

export type IClassGroup = {
  name: string;
  description: string;
  customers: ICustomer[];
};

export type ISchool = {
  name: string;
  description: string;
  customers: ICustomer[];
};
