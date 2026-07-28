import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from '../components/DatePicker';
import RichTextEditor from '../components/RichTextEditor';
import TagBadge from '../components/TagBadge';
import TagSelect from '../components/TagSelect';
import type { Note, NoteDraft, TagId } from '../types/note';

interface NoteDetailProps {
  mode: 'create' | 'view';
  getNote: (id: string) => Note | undefined;
  createNote: (draft: NoteDraft) => Note;
  updateNote: (id: string, draft: NoteDraft) => void;
  deleteNote: (id: string) => void;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_DRAFT: NoteDraft = {
  title: '',
  description: '',
  content: '',
  tag: 'personal',
  date: todayISO(),
};

export default function NoteDetail({
  mode,
  getNote,
  createNote,
  updateNote,
  deleteNote,
}: NoteDetailProps) {
  const navigate = useNavigate();
  const { noteId } = useParams();
  const existing = mode === 'view' && noteId ? getNote(noteId) : undefined;

  const [isEditing, setIsEditing] = useState(mode === 'create');
  const [draft, setDraft] = useState<NoteDraft>(existing ?? EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existing) setDraft(existing);
  }, [existing]);

  if (mode === 'view' && !existing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="font-display text-2xl text-ink">This note isn't in the catalog</p>
        <p className="mt-1 text-sm text-muted">It may have been deleted.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="focus-ring mt-6 rounded-md bg-ledger px-4 py-2 font-mono text-sm text-white"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const handleField = <K extends keyof NoteDraft>(key: K, value: NoteDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!draft.title.trim()) {
      setError('Give the note a title before saving.');
      return;
    }
    setError(null);
    if (mode === 'create') {
      const created = createNote(draft);
      navigate(`/note/${created.id}`, { replace: true });
    } else if (existing) {
      updateNote(existing.id, draft);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (mode === 'create') {
      navigate('/');
      return;
    }
    if (existing) setDraft(existing);
    setError(null);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (existing) {
      deleteNote(existing.id);
      navigate('/');
    }
  };

  const formattedDate = new Date(`${draft.date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="mx-auto max-w-3xl px-3 py-10 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="focus-ring mb-6 inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-mono text-xs uppercase tracking-wide text-muted hover:text-ink"
      >
        <span aria-hidden>←</span> Back to catalog
      </button>

      <div className="overflow-hidden rounded-xl bg-card shadow-card">
        {/* Header */}
        <div className="border-b border-line px-2 py-3 sm:px-8">
          {isEditing ? (
            <div>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => handleField('title', e.target.value)}
                placeholder="Note title"
                className="mb-2 w-full rounded-md border border-line bg-transparent px-0 pl-2 font-display text-2xl font-medium text-ink placeholder:text-muted focus:border-line focus:bg-paper/40 focus:px-2 sm:text-3xl"
              />{' '}
              <DatePicker value={draft.date} onChange={(d) => handleField('date', d)} />
              <div className="mt-4">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted">Tag</p>
                <TagSelect value={draft.tag} onChange={(t: TagId) => handleField('tag', t)} />
              </div>
            </div>
          ) : (
            <div>
              <h1 className="font-display text-2xl font-medium text-ink sm:text-3xl">
                {draft.title}
              </h1>{' '}
              <span className="font-mono text-xs text-muted">{formattedDate}</span>
              <TagBadge tag={draft.tag} size="md" />
            </div>
          )}
        </div>

        <div className="px-2 py-3 sm:px-8">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted">
            Description
          </p>
          {isEditing ? (
            <textarea
              value={draft.description}
              onChange={(e) => handleField('description', e.target.value)}
              placeholder="A one- or two-line summary shown on the card preview…"
              rows={2}
              className="w-full rounded-md border border-line bg-card px-3 py-2 text-sm text-ink placeholder:text-muted"
            />
          ) : (
            <p className="text-sm leading-relaxed text-muted">
              {draft.description || 'No description.'}
            </p>
          )}
        </div>

        <div className="px-2 py-3 sm:px-8">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-muted">Note</p>
          <RichTextEditor
            resetKey={existing?.id ?? 'new'}
            value={draft.content}
            onChange={(html) => handleField('content', html)}
            editable={isEditing}
            placeholder="Write the full note here…"
          />
        </div>

        {error && (
          <p className="px-6 pb-2 text-sm text-[#AB4B3E] sm:px-8" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-paper/40 px-6 py-4 sm:px-8">
          <div>
            {mode === 'view' && !isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="focus-ring rounded-md border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-muted hover:border-[#AB4B3E] hover:text-[#AB4B3E]"
              >
                Delete note
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="focus-ring rounded-md border border-line px-4 py-2 font-mono text-sm text-muted hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="focus-ring rounded-md bg-ledger px-4 py-2 font-mono text-sm font-medium text-white hover:bg-ledger-dark"
                >
                  Save note
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="focus-ring rounded-md bg-amber px-4 py-2 font-mono text-sm font-medium text-white hover:bg-amber-dark"
              >
                Edit note
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
