import { useMemo } from 'react';
import type { Note } from '../types/note';
import { TAGS } from '../types/note';

interface StatsBarProps {
  notes: Note[];
}

function isThisWeek(dateISO: string): boolean {
  const date = new Date(dateISO);
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return date >= start && date < end;
}

export default function StatsBar({ notes }: StatsBarProps) {
  const stats = useMemo(() => {
    const total = notes.length;
    const thisWeek = notes.filter((n) => isThisWeek(n.date)).length;
    const tagCounts = new Map<string, number>();
    notes.forEach((n) => tagCounts.set(n.tag, (tagCounts.get(n.tag) ?? 0) + 1));
    let topTag = 'none';
    let topCount = 0;
    tagCounts.forEach((count, tag) => {
      if (count > topCount) {
        topCount = count;
        topTag = tag;
      }
    });
    const topTagLabel = TAGS.find((t) => t.id === topTag)?.label ?? '—';
    const lastUpdated = notes.reduce<string | null>((latest, n) => {
      if (!latest || n.updatedAt > latest) return n.updatedAt;
      return latest;
    }, null);
    return {
      total,
      thisWeek,
      distinctTags: tagCounts.size,
      topTagLabel: topCount > 0 ? topTagLabel : '—',
      lastUpdated: lastUpdated ? new Date(lastUpdated).toLocaleDateString() : '—',
    };
  }, [notes]);

  const entries: Array<{ label: string; value: string | number }> = [
    { label: 'Total notes', value: stats.total },
    { label: 'Logged this week', value: stats.thisWeek },
    { label: 'Tags in use', value: stats.distinctTags },
    { label: 'Most used tag', value: stats.topTagLabel },
    { label: 'Last entry', value: stats.lastUpdated },
  ];

  return (
    <div className="relative overflow-hidden rounded-lg bg-ledger shadow-card">
      <div className="flex flex-col divide-y divide-white/10 sm:flex-row sm:divide-x sm:divide-y-0">
        {entries.map((entry) => (
          <div key={entry.label} className="flex-1 px-5 py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/60">
              {entry.label}
            </p>
            <p className="mt-1 truncate font-display text-2xl font-medium text-white">
              {entry.value}
            </p>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/10 to-transparent" />
    </div>
  );
}
