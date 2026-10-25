// ---------------------------------------------------------------------------
// Fake data for the Documents / Contracts screen
// Replace these with real API calls when the backend is ready
// ---------------------------------------------------------------------------

export type DocumentCategory = 'contracts' | 'invoices' | 'personal';
export type DocumentFileType = 'pdf' | 'image' | 'other';

export interface FakeDocument {
  id: string;
  title: string;
  /** ISO date string */
  date: string;
  /** Name of the worker / person involved */
  workerName: string;
  category: DocumentCategory;
  fileType: DocumentFileType;
  /** Optional thumbnail URI (image docs) */
  thumbnailUri?: string;
  /** File size in KB */
  sizeKb: number;
  isNew?: boolean;
}

export interface FakeFolder {
  id: DocumentCategory;
  label: string;
  /** Number of documents inside */
  count: number;
  iconName: string; // Feather icon name
}

// ─── Folders ────────────────────────────────────────────────────────────────

export const FAKE_FOLDERS: FakeFolder[] = [
  { id: 'contracts', label: 'Contrats', count: 12, iconName: 'file-text' },
  { id: 'invoices', label: 'Factures', count: 8, iconName: 'dollar-sign' },
  { id: 'personal', label: 'Personnel', count: 5, iconName: 'user' },
];

// ─── Documents ──────────────────────────────────────────────────────────────

export const FAKE_DOCUMENTS: FakeDocument[] = [
  {
    id: '1',
    title: 'CEDU du 17/07/2026',
    date: '2026-07-17',
    workerName: 'Jean Dupont',
    category: 'contracts',
    fileType: 'pdf',
    sizeKb: 245,
    isNew: true,
  },
  {
    id: '2',
    title: 'CEDU du 08/07/2026',
    date: '2026-07-08',
    workerName: 'Julie Doe (En cours)',
    category: 'contracts',
    fileType: 'pdf',
    sizeKb: 198,
  },
  {
    id: '3',
    title: 'Extrait RNE - Répertoire National des Entreprises',
    date: '2026-06-28',
    workerName: '',
    category: 'personal',
    fileType: 'pdf',
    sizeKb: 512,
  },
  {
    id: '4',
    title: 'CEDU du 24/06/2026',
    date: '2026-06-24',
    workerName: 'Xavier Lagonnes',
    category: 'contracts',
    fileType: 'pdf',
    sizeKb: 230,
  },
  {
    id: '5',
    title: "CNI - Représentant de l'entreprise",
    date: '2026-06-20',
    workerName: '',
    category: 'personal',
    fileType: 'image',
    thumbnailUri: 'https://placehold.co/80x100/E8E8E8/313131?text=CNI',
    sizeKb: 1024,
  },
  {
    id: '6',
    title: 'CEDU du 25/05/2026',
    date: '2026-05-25',
    workerName: 'Théo Jaipasslemp',
    category: 'contracts',
    fileType: 'pdf',
    sizeKb: 215,
  },
  {
    id: '7',
    title: 'CEDU du 25/04/2026',
    date: '2026-04-25',
    workerName: 'Théo Jaipasslemp',
    category: 'contracts',
    fileType: 'pdf',
    sizeKb: 215,
  },
  {
    id: '8',
    title: 'CEDU du 20/06/2026',
    date: '2026-06-20',
    workerName: 'Théo Jaipasslemp (temp)',
    category: 'contracts',
    fileType: 'pdf',
    sizeKb: 210,
  },
  {
    id: '9',
    title: 'Facture Prestation Mars 2026',
    date: '2026-03-31',
    workerName: 'Cabinet Comptable',
    category: 'invoices',
    fileType: 'pdf',
    sizeKb: 330,
  },
  {
    id: '10',
    title: 'CEDU du 12/04/2026',
    date: '2026-04-12',
    workerName: 'Théo Jaipasslemp',
    category: 'contracts',
    fileType: 'pdf',
    sizeKb: 220,
  },
  {
    id: '11',
    title: 'CEDU du 01/05/2026',
    date: '2026-05-01',
    workerName: 'Théo Jaipasslemp',
    category: 'contracts',
    fileType: 'pdf',
    sizeKb: 218,
  },
  {
    id: '12',
    title: 'CEDU du 17/04/2026',
    date: '2026-04-17',
    workerName: 'Théo Jaipasslemp',
    category: 'contracts',
    fileType: 'pdf',
    sizeKb: 210,
  },
  {
    id: '13',
    title: 'CEDU du 17/03/2026',
    date: '2026-03-17',
    workerName: 'Théo Jaipasslemp',
    category: 'contracts',
    fileType: 'pdf',
    sizeKb: 205,
  },
];

/** The 5 most recent documents (shown in the "Récents" horizontal scroll) */
export const RECENT_DOCUMENTS = [...FAKE_DOCUMENTS]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5);

/** Helper – filter documents by category */
export function getDocumentsByCategory(category: DocumentCategory | null): FakeDocument[] {
  if (!category) return FAKE_DOCUMENTS;
  return FAKE_DOCUMENTS.filter((d) => d.category === category);
}
