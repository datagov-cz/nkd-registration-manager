
export interface RegistrationEntry {

  identifier: string;

  /**
   * Where is the registration record from.
   */
  source: RegistrationSourceType;

  type: RegistrationEntryType;

  /**
   * When was the entry created in the system.
   */
  createdAt: Date;

  /**
   * Not every databox is mapped to an organization.
   */
  organization: string;

  label: { [language: string]: string };

  /**
   * Content of an attachment file as JSON-LD.
   */
  attachmentPath: string;

}

export enum RegistrationSourceType {
  ISDS = "isds",
  RegistrationManager = "registration-manager",
}

export enum RegistrationEntryType {
  CreateDataset = "create-dataset",
  WithdrawDataset = "withdraw-dataset",
  CreateCatalog = "create-catalog",
  WithdrawCatalog = "withdraw-catalog",
}
