import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotesGrid from '../components/NotesGrid';
import StatsBar from '../components/StatsBar';
import { TAGS, type Note, type TagId } from '../types/note';

interface DashboardProps {
  notes: Note[];
}

export default function Dashboard({ notes }: DashboardProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<TagId | 'all'>('all');

  const filteredNotes = useMemo(() => {
    return notes
      .filter((n) => activeTag === 'all' || n.tag === activeTag)
      .filter((n) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [notes, query, activeTag]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-amber-dark">
          Fieldnotes · Catalog
        </p>
        <h1 className="font-display text-3xl font-medium text-ink sm:text-4xl">Your notes</h1>
        <p className="text-sm text-muted">
          A running index of what you've written down — search it, sort it, or add to it.
        </p>
      </header>

      <section className="mb-8">
        <StatsBar notes={notes} />
      </section>

      <section className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full">
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="m17 17-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes…"
              className="focus-ring w-full rounded-md border border-line bg-card py-2 pl-9 pr-3 text-sm text-ink placeholder:text-muted"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTag('all')}
              className={`focus-ring rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide ${
                activeTag === 'all'
                  ? 'border-ink bg-ink text-white'
                  : 'border-line bg-card text-muted hover:text-ink'
              }`}
            >
              All
            </button>
            {TAGS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setActiveTag(tag.id)}
                className={`focus-ring rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide ${
                  activeTag === tag.id
                    ? 'border-transparent text-white'
                    : 'border-line bg-card text-muted hover:text-ink'
                }`}
                style={activeTag === tag.id ? { backgroundColor: tag.swatch } : undefined}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/note/new')}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ledger px-4 py-2 font-mono text-sm font-medium text-white shadow-card transition-colors hover:bg-ledger-dark"
        >
          <span className="text-base leading-none">+</span> New note
        </button>
      </section>

      <NotesGrid notes={filteredNotes} />
    </div>
  );
}
