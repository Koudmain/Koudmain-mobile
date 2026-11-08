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
}

export type RootViewMode = 'list' | 'folders';

export type FolderDisplayMode = 'list' | 'grid';
