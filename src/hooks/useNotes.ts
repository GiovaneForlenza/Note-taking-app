import { useCallback, useEffect, useState } from 'react';
import type { Note, NoteDraft } from '../types/note';

const STORAGE_KEY = 'fieldnotes.notes.v1';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function seedNotes(): Note[] {
  const now = new Date().toISOString();
  return [
    {
      id: uid(),
      title: 'Kickoff call recap',
      description: 'Notes from the Q3 planning sync with the product team.',
      content:
        '<p>Agreed on <strong>three priorities</strong> for the quarter: onboarding, performance, and the ' +
        '<mark style="background-color:#F5E663">new tagging system</mark>. Design review scheduled for next week.</p>',
      tag: 'work',
      date: todayISO(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: 'Weekend hike checklist',
      description: 'What to pack for the Ridgeline trail before the weather turns.',
      content:
        '<p>Bring the <u>new water filter</u>, extra socks, and the <mark style="background-color:#B8E6B0">first aid kit</mark>. ' +
        'Check trailhead parking the night before.</p>',
      tag: 'personal',
      date: todayISO(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: 'App idea: shared grocery lists',
      description: 'Quick concept sketch for a household grocery app with real-time sync.',
      content:
        '<p>Core loop: add an item, it <strong>syncs instantly</strong> to everyone in the household. ' +
        '<mark style="background-color:#ADD8E6">Stretch goal</mark>: auto-suggest items based on past lists.</p>',
      tag: 'ideas',
      date: todayISO(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: 'Renew passport',
      description: 'Expires next month — book an appointment this week.',
      content:
        '<p>Bring old passport, printed photo, and the <strong>confirmation email</strong>.</p>',
      tag: 'urgent',
      date: todayISO(),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: 'Reading list: systems design',
      description: 'Papers and posts to get through before the interview loop.',
      content:
        '<p>Start with the <strong>consistent hashing</strong> paper, then the ' +
        '<mark style="background-color:#ADD8E6">load balancing</mark> chapter. ' +
        '<u>Skip the sharding appendix</u> for now — revisit later.</p>',
      tag: 'reading',
      date: daysAgoISO(2),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: 'Old apartment lease notes',
      description: 'Terms from the 2022 lease, kept for reference after moving out.',
      content:
        '<p>Security deposit was <strong>$1,400</strong>, returned in full. Landlord contact ' +
        'kept on file in case the new building asks for a reference.</p>',
      tag: 'archive',
      date: daysAgoISO(340),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: 'Standup notes — sprint 14',
      description: 'Blockers and callouts from the Tuesday sync.',
      content:
        '<p><mark style="background-color:#F5E663">Blocked</mark> on the staging deploy until infra ' +
        'finishes the migration. <u>Design</u> is unblocked and starting review today. ' +
        '<strong>No changes</strong> to the sprint scope.</p>',
      tag: 'work',
      date: daysAgoISO(1),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: 'Birthday gift ideas for mom',
      description: 'Running list before her birthday next month.',
      content:
        '<p>She mentioned the <strong>ceramics class</strong> a few times — maybe a studio gift card. ' +
        '<mark style="background-color:#F3B8C9">Backup idea</mark>: the scarf from the shop downtown.</p>',
      tag: 'personal',
      date: daysAgoISO(5),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uid(),
      title: 'Book highlights: Atomic Habits',
      description: 'Passages worth remembering from the last few chapters.',
      content:
        '<p>Core idea: <strong>habits are the compound interest of self-improvement</strong>. ' +
        '<mark style="background-color:#B8E6B0">Identity-based habits</mark> stick better than outcome-based ones. ' +
        '<u>Reread the chapter on habit stacking.</u></p>',
      tag: 'reading',
      date: daysAgoISO(12),
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedNotes();
    const parsed = JSON.parse(raw) as Note[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedNotes();
    return parsed;
  } catch {
    return seedNotes();
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const createNote = useCallback((draft: NoteDraft): Note => {
    const now = new Date().toISOString();
    const note: Note = { ...draft, id: uid(), createdAt: now, updatedAt: now };
    setNotes((prev) => [note, ...prev]);
    return note;
  }, []);

  const updateNote = useCallback((id: string, draft: NoteDraft) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...draft, updatedAt: new Date().toISOString() } : n)),
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const getNote = useCallback((id: string) => notes.find((n) => n.id === id), [notes]);

  return { notes, createNote, updateNote, deleteNote, getNote };
}
