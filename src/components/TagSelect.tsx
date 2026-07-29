import { TAGS, type TagId } from '../types/note';

interface TagSelectProps {
  value: TagId;
  onChange: (tag: TagId) => void;
  disabled?: boolean;
}

export default function TagSelect({ value, onChange, disabled }: TagSelectProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {TAGS.map((tag) => {
        const active = tag.id === value;
        return (
          <button
            key={tag.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tag.id)}
            className={`-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-xs font-medium uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              active
                ? 'border-transparent text-white'
                : 'border-line bg-card text-muted hover:text-ink'
            }`}
            style={active ? { backgroundColor: tag.swatch } : undefined}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: active ? '#ffffff' : tag.swatch }}
            />
            {tag.label}
          </button>
        );
      })}
    </div>
  );
}
