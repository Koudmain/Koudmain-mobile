export * from '@koudmain/ui/types/application';

export type KycDocumentType = 'IDENTITY' | 'RIB' | 'PROOF_OF_ADDRESS' | 'NIR' | 'DIPLOMA';

export type EligibilityReason =
  | 'WORKER_PROFILE_NOT_FOUND'
  | 'KYC_REQUIRED'
  | 'PUBLICATION_NOT_FOUND'
  | 'OFFER_EXPIRED'
  | 'ALREADY_APPLIED'
  | 'MESSAGE_TOO_LONG'
  | 'NOT_AUTHORIZED'
  | 'APPLICATION_NOT_FOUND'
  | 'CANNOT_CANCEL_PROCESSED';

export interface CheckEligibilityResponseDto {
  canApply: boolean;
  reason?: EligibilityReason;
  message?: string;
  missingDocuments?: KycDocumentType[];
  completionPercentage?: number;
}

export interface ApplyDto {
  publicationId: number;
  message?: string;
}
