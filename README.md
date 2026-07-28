# Fieldnotes

A small notes app built with React + Vite + TypeScript + Tailwind CSS. Notes are stored in
`localStorage`, so nothing leaves the browser.

## Stack

- **Vite** (latest) — dev server / build
- **React 18** + **TypeScript** — plain functional components, no extra state library
- **react-router-dom** — dashboard ↔ note page navigation
- **Tailwind CSS** — styling, with a small custom design token set (see `tailwind.config.js`)
- **Prettier** + `prettier-plugin-tailwindcss` — auto-sorts Tailwind classes on format

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build     # type-check + production build
npm run preview   # preview the production build
npm run format    # run Prettier (with the Tailwind class-sorting plugin) across the project
npm run lint      # ESLint
```

## Structure

```
src/
  components/
    StatsBar.tsx        dashboard stats strip (total notes, this week, tags in use, etc.)
    NoteCard.tsx         index-card style preview (title, description, date, tag)
    NotesGrid.tsx        grid layout + empty state
    TagBadge.tsx         small colored tag pill
    TagSelect.tsx        tag picker used in the editor
    DatePicker.tsx       styled native <input type="date">
    RichTextEditor.tsx   contentEditable editor: bold, underline, multi-color highlight
  pages/
    Dashboard.tsx        stats + search/filter toolbar + notes grid
    NoteDetail.tsx        full note page — view mode and edit mode, create-new flow
  hooks/
    useNotes.ts          localStorage-backed CRUD for notes, plus seed data
  types/
    note.ts              Note / Tag types and the fixed tag list
```

## Notes on the rich text editor

The editor uses the browser's built-in `contentEditable` + `document.execCommand` for
bold/underline/highlight, rather than a heavier dependency like TipTap or Slate, to keep the
project's structure simple per the brief. `execCommand` is deprecated but still broadly
supported for these basic formatting commands across current Chrome, Firefox, Safari, and Edge.
If you later want undo history, markdown export, or slash-commands, swapping
`RichTextEditor.tsx` for a TipTap-based implementation would be a contained change — the rest of
the app only talks to it through the `value` / `onChange` HTML string.

## Design

The visual language is a "card catalog" / index-card system: note cards carry a small colored
tab (keyed to the tag color), the dashboard stats render like a library drawer label, and dates
use a monospace face to read like catalog metadata. Typefaces: **Fraunces** (display), **Inter**
(body), **IBM Plex Mono** (dates, tags, stats).
