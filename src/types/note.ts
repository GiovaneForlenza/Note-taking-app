export type TagId = 'work' | 'personal' | 'ideas' | 'urgent' | 'reading' | 'archive';

export interface Tag {
  id: TagId;
  label: string;
  /** Tailwind color classes used for the tab + badge accents. */
  swatch: string;
}

export const TAGS: Tag[] = [
  { id: 'work', label: 'Work', swatch: '#3B5249' },
  { id: 'personal', label: 'Personal', swatch: '#f2045E' },
  { id: 'ideas', label: 'Ideas', swatch: '#7A5C8E' },
  { id: 'urgent', label: 'Urgent', swatch: '#AB4B3E' },
  { id: 'reading', label: 'Reading', swatch: '#3C6E8F' },
  { id: 'archive', label: 'Archive', swatch: '#6B6555' },
];

export function getTag(id: TagId): Tag {
  return TAGS.find((t) => t.id === id) ?? TAGS[0];
}

export interface Note {
  id: string;
  title: string;
  description: string;
  /** Rich HTML content produced by the RichTextEditor. */
  content: string;
  tag: TagId;
  /** ISO date string (yyyy-mm-dd) chosen via the date picker. */
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type NoteDraft = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
