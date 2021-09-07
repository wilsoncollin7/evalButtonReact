export interface Permit {
  healthPermitProjectKey: number,
  healthPermitKey?: number,
  permitTypeKey: number,
  description: string,
  permitNumber: string,
  dateIssued?: Date | null,
  permitAmount: number,
  pendingPayment: boolean,
  permitStatusKey?: number | null,
  finalPassed: boolean,
  creationDate?: Date | null,
  createUser: string,
  updateUser: string,
  createDate?: Date,
  updateDate?: Date,
  expireDate?: Date,
  eventConfirm: boolean
};

export interface PermitAttributes {
  EstablishmentType: string,
  GDP: string,
  PerUnitDescription: string,
  description: string,
  evaluationResults: string,
  fee: number,
  helpText: string,
  per: string,
  siteBy: string,
  siteClass: string,
  siteDate: string,
  siteEvalType: string,
  specialInstructions: string,
  permitTypeKey: number
};

export interface PermitProject {
  healthPermitProjectKey: number,
  parcelID: string,
  permitNumber: string,
  projectTypeKey: number,
  projectStatusKey: number
};

export interface Payment {
  healthPermitKey: number,
  healthInvoicePaymentsKey: number,
  paymentNumber: number,
  paymentDate: Date,
  paymentAmount: number,
  notes: string
};

export interface Invoice {
  healthinvoiceKey: number,
  invoiceNumber: string,
  invoiceDate: Date,
  CreateDate: Date,
  invoicedAmount: number,
  healthpermitKey: number
};

export interface UserData {
  userName: string,
  groups: string[],
  roles: string[],
  developer: boolean,
  wasDeveloper: boolean,
  domainUser: boolean,
  public: boolean,
  ready: boolean,
  repositoryURL: string
};

export interface FormUI {
  attributeDataType: string
  description: string,
  displayColumn: number,
  value: string
};
