import { getTag, type TagId } from '../types/note';

interface TagBadgeProps {
  tag: TagId;
  size?: 'sm' | 'md';
}

export default function TagBadge({ tag, size = 'sm' }: TagBadgeProps) {
  const meta = getTag(tag);
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-mono font-medium uppercase tracking-wide ${sizeClasses}`}
      style={{ backgroundColor: `${meta.swatch}1a`, color: meta.swatch }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.swatch }} />
      {meta.label}
    </span>
  );
}
