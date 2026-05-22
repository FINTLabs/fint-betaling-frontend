export interface IOrganisationUnit {
  organisationNumber: string;
  name: string;
}

export interface IUser {
  name: string;
  employeeNumber: string;
  organisation: IOrganisationUnit;
  organisationUnits: IOrganisationUnit[];
  idleTime: number; // Time in milliseconds
  admin: boolean;
}
