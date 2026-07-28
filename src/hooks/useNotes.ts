import { useCallback, useEffect, useState } from 'react';
import type { Note, NoteDraft } from '../types/note';

const STORAGE_KEY = 'fieldnotes.notes.v1';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
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
      content: '<p>Bring old passport, printed photo, and the <strong>confirmation email</strong>.</p>',
      tag: 'urgent',
      date: todayISO(),
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
