export type EntityType = 'Corp' | 'Partnership' | 'Sole Proprietor' | 'Non Profit' | 'Single-member LLC';

export interface CompanyFormData {
  entityName: string;
  entityType: EntityType | '';
  fein: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  nysUnemploymentNumber: string;
}

export interface CompanyFormErrors {
  entityName: string;
  entityType: string;
  fein: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zipCode: string;
  phoneNumber: string;
  nysUnemploymentNumber: string;
}

export type UnionStatus = 'Non-Union' | 'Union';
export type AgreementType = 
  | 'Equity/League Production Contract'
  | 'Off-Broadway Agreement'
  | 'Development Agreement (Work Session)'
  | '29 Hour Reading'
  | '';

export type MusicalOrDramaticType = 'Musical' | 'Dramatic' | '';
export type TierType = 'Tier 1' | 'Tier 2' | 'Tier 3' | '';

export interface UnionConfigurationData {
  unionStatus: UnionStatus;
  union: string;
  agreementType: AgreementType;
  musicalOrDramatic: MusicalOrDramaticType;
  tier: TierType;
  aeaEmployerId: string;
  aeaProductionTitle: string;
  aeaBusinessRep: string;
}

export type AccountType = 'Checking' | 'Savings';

export interface BankData {
  name: string;
  routingACH: string;
  routingWire: string;
}

export interface BankSetupData {
  bankName: string;
  routingACH: string;
  routingWire: string;
  accountNumber: string;
  confirmAccountNumber: string;
  accountType: AccountType | '';
  authorize: boolean;
}

export type SignaturePolicy = 'single' | 'double';
export type SignatureMethod = 'upload' | 'draw' | '';

export interface SignatureSetupData {
  signaturePolicy: SignaturePolicy;
  sig1Method: SignatureMethod;
  sig2Method: SignatureMethod;
}