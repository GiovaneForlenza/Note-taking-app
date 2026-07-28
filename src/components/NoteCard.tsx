import { useNavigate } from 'react-router-dom';
import type { Note } from '../types/note';
import { getTag } from '../types/note';
import TagBadge from './TagBadge';

interface NoteCardProps {
  note: Note;
}

function formatDate(dateISO: string): string {
  const d = new Date(`${dateISO}T00:00:00`);
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function NoteCard({ note }: NoteCardProps) {
  const navigate = useNavigate();
  const tagMeta = getTag(note.tag);

  return (
    <div
      onClick={() => navigate(`/note/${note.id}`)}
      className="focus-ring group relative flex h-full cursor-pointer flex-col rounded-lg rounded-tl-none bg-card p-3 text-left shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-cardHover"
    >
      {/* Die-cut tab, colored per tag — the card-catalog signature */}
      {/* <span
        aria-hidden
        className="absolute -left-1 -top-3 h-3 w-16 rounded-t-md"
        style={{ backgroundColor: tagMeta.swatch }}
      /> */}

      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-medium leading-snug text-ink">{note.title}</h3>
      </div>

      <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{note.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className="font-mono text-xs text-muted">{formatDate(note.date)}</span>
        <TagBadge tag={note.tag} />
      </div>
    </div>
  );
}
