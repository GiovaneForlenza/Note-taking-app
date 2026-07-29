import { useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  /** Changing this remounts the editor content — pass the note id. */
  resetKey: string;
  editable?: boolean;
  placeholder?: string;
}

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: '#F5E663' },
  { name: 'Green', value: '#B8E6B0' },
  { name: 'Pink', value: '#F3B8C9' },
  { name: 'Blue', value: '#ADD8E6' },
];

type Command = 'bold' | 'underline';

function ToolbarButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md border text-sm transition-colors ${
        active
          ? 'border-ledger bg-ledger text-white'
          : 'border-line bg-card text-ink hover:bg-paper'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
  resetKey,
  editable = true,
  placeholder = 'Start writing…',
}: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [activeMarks, setActiveMarks] = useState<Record<Command, boolean>>({
    bold: false,
    underline: false,
  });
  const [highlightOpen, setHighlightOpen] = useState(false);

  // Only reset innerHTML when switching notes, so typing doesn't fight the cursor.
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const syncActiveMarks = () => {
    setActiveMarks({
      bold: document.queryCommandState('bold'),
      underline: document.queryCommandState('underline'),
    });
  };

  const exec = (command: Command) => {
    ref.current?.focus();
    document.execCommand(command);
    syncActiveMarks();
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const applyHighlight = (color: string | null) => {
    ref.current?.focus();
    const target = color ?? 'transparent';
    // Chrome/Edge support 'highlighColor'; older Firefox needs 'backColor' as a fallback.
    const applied = document.execCommand('highlighColor', false, target);
    if (!applied) document.execCommand('backColor', false, target);
    setHighlightOpen(false);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  return (
    <div className="rounded-lg border border-line bg-card">
      {editable && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-1.5 py-1">
          <ToolbarButton active={activeMarks.bold} onClick={() => exec('bold')} label="Bold">
            <span className="font-serif font-bold">B</span>
          </ToolbarButton>
          <ToolbarButton
            active={activeMarks.underline}
            onClick={() => exec('underline')}
            label="Underline"
          >
            <span className="underline">U</span>
          </ToolbarButton>

          <div className="relative">
            <ToolbarButton
              active={highlightOpen}
              onClick={() => setHighlightOpen((v) => !v)}
              label="Highlight"
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-sm text-[10px] font-semibold"
                style={{ backgroundColor: '#F5E663' }}
              >
                H
              </span>
            </ToolbarButton>
            {highlightOpen && (
              <div className="absolute left-0 top-9 z-10 flex flex-wrap items-center gap-1.5 rounded-md border border-line bg-card p-2 shadow-cardHover sm:flex-nowrap">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    aria-label={`Highlight ${c.name}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyHighlight(c.value)}
                    className="h-6 w-6 rounded-full border border-black/30 transition-transform hover:scale-110"
                    style={{ backgroundColor: c.value }}
                  />
                ))}
                <span className="h-0 w-px bg-line sm:mx-1 sm:h-5" />
                <button
                  type="button"
                  aria-label="Remove highlight"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyHighlight(null)}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-line text-[11px] text-muted hover:text-ink"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        ref={ref}
        className="note-prose min-h-[220px] px-1.5 py-1"
        contentEditable={editable}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={() => {
          if (ref.current) onChange(ref.current.innerHTML);
        }}
        onKeyUp={syncActiveMarks}
        onMouseUp={syncActiveMarks}
        onFocus={syncActiveMarks}
        onBlur={() => setHighlightOpen(false)}
      />
    </div>
  );
}
