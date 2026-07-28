import type { Note } from '../types/note';
import NoteCard from './NoteCard';

interface NotesGridProps {
  notes: Note[];
}

export default function NotesGrid({ notes }: NotesGridProps) {
  if (notes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-card/60 px-6 py-16 text-center">
        <p className="font-display text-xl text-ink">No notes match yet</p>
        <p className="mt-1 text-sm text-muted">
          Try a different search, clear the tag filter, or start a new entry.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
