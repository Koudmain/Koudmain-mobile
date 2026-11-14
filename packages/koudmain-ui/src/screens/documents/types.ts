import { ApiDocument, BackendDocumentCategory } from '../../api/document.api';

export type FolderType = 'Contrats' | 'Factures' | 'Personnel' | 'Autres';

export type DocumentCategory = 'pdf' | 'image' | 'other';

export type ThumbnailType = 'pdf' | 'cni' | 'image';

export interface DocumentItem {
  id: string;
  title: string;
  shortTitle?: string;
  date: string;
  folder: FolderType;
  category: DocumentCategory;
  thumbnailType?: ThumbnailType;
  fileUri?: string;
  raw?: ApiDocument;
}

export type RootViewMode = 'list' | 'folders';

export type FolderDisplayMode = 'list' | 'grid';

export function mapCategoryToFolder(category: BackendDocumentCategory): FolderType {
  switch (category) {
    case 'CONTRACT':
      return 'Contrats';
    case 'INVOICE':
      return 'Factures';
    case 'IDENTITY':
    case 'RIB':
    case 'DIPLOMA':
    case 'KBIS':
      return 'Personnel';
    case 'OTHER':
    default:
      return 'Autres';
  }
}

export function mapMimeTypeToCategory(mimeType: string): DocumentCategory {
  if (mimeType?.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'other';
}

export function mapToThumbnailType(
  category: BackendDocumentCategory,
  mimeType: string,
): ThumbnailType {
  if (category === 'IDENTITY') return 'cni';
  if (mimeType?.startsWith('image/')) return 'image';
  return 'pdf';
}

export function formatDocumentDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return dateString;
  }
}

export function mapApiDocumentToItem(apiDoc: ApiDocument): DocumentItem {
  return {
    id: String(apiDoc.id),
    title: apiDoc.name,
    shortTitle: apiDoc.originalFilename || apiDoc.name,
    date: formatDocumentDate(apiDoc.createdAt),
    folder: mapCategoryToFolder(apiDoc.category),
    category: mapMimeTypeToCategory(apiDoc.mimeType),
    thumbnailType: mapToThumbnailType(apiDoc.category, apiDoc.mimeType),
    raw: apiDoc,
  };
}
