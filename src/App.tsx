import { Route, Routes } from 'react-router-dom';
import { useNotes } from './hooks/useNotes';
import Dashboard from './pages/Dashboard';
import NoteDetail from './pages/NoteDetail';

export default function App() {
  const { notes, createNote, updateNote, deleteNote, getNote } = useNotes();

  return (
    <Routes>
      <Route path="/" element={<Dashboard notes={notes} />} />
      <Route
        path="/note/new"
        element={
          <NoteDetail
            mode="create"
            getNote={getNote}
            createNote={createNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
          />
        }
      />
      <Route
        path="/note/:noteId"
        element={
          <NoteDetail
            mode="view"
            getNote={getNote}
            createNote={createNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
          />
        }
      />
    </Routes>
  );
}
