import { apiFetch } from '../utils/api';

export type BackendDocumentCategory =
  | 'IDENTITY'
  | 'RIB'
  | 'DIPLOMA'
  | 'KBIS'
  | 'CONTRACT'
  | 'INVOICE'
  | 'OTHER';

export interface DocumentAssignment {
  id: number;
  companyId: number | null;
  workerId: number | null;
  userId: number | null;
  type: string;
  verified: boolean;
}

export interface ApiDocument {
  id: number;
  name: string;
  category: BackendDocumentCategory;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  assignments?: DocumentAssignment[];
}

export interface DocumentDownloadResponse {
  url: string;
  expiresIn: number;
}

export interface DocumentQueryParams {
  category?: BackendDocumentCategory | string;
  type?: string;
  search?: string;
}

function buildQueryString(params?: DocumentQueryParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  if (params.category) searchParams.append('category', params.category);
  if (params.type) searchParams.append('type', params.type);
  if (params.search) searchParams.append('search', params.search);
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const documentService = {
  /**
   * 1. Documents Personnels (User)
   * GET /document/user/me
   */
  getUserDocuments: async (token: string, params?: DocumentQueryParams): Promise<ApiDocument[]> => {
    return apiFetch<ApiDocument[]>(`/document/user/me${buildQueryString(params)}`, {
      method: 'GET',
      token,
    });
  },

  /**
   * 2. Documents Travailleur (Worker)
   * GET /document/worker/me
   */
  getWorkerDocuments: async (
    token: string,
    params?: DocumentQueryParams,
  ): Promise<ApiDocument[]> => {
    return apiFetch<ApiDocument[]>(`/document/worker/me${buildQueryString(params)}`, {
      method: 'GET',
      token,
    });
  },

  /**
   * 3. Documents Entreprise (Company)
   * GET /document/company/:companyId
   */
  getCompanyDocuments: async (
    token: string,
    companyId: number | string,
    params?: DocumentQueryParams,
  ): Promise<ApiDocument[]> => {
    return apiFetch<ApiDocument[]>(`/document/company/${companyId}${buildQueryString(params)}`, {
      method: 'GET',
      token,
    });
  },

  /**
   * 4. Télécharger / Visualiser le fichier
   * GET /document/:id/download
   */
  getDownloadUrl: async (
    token: string,
    documentId: number | string,
  ): Promise<DocumentDownloadResponse> => {
    return apiFetch<DocumentDownloadResponse>(`/document/${documentId}/download`, {
      method: 'GET',
      token,
    });
  },
};
