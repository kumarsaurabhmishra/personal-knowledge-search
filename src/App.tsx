import { useMemo, useState } from 'react';
import './App.css';
import { NoteForm } from './components/NoteForm';
import { NoteList } from './components/NoteList';
import { NoteDetail } from './components/NoteDetail';
import { useNotes } from './hooks/useNotes';
import type { NoteInput } from './models/note';

type ViewMode = 'empty' | 'detail' | 'form';

function App() {
  const { notes, loading, error, create, update, remove } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<ViewMode>('empty');

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMode('detail');
  };

  const handleNewNote = () => {
    setSelectedId(null);
    setMode('form');
  };

  const handleEdit = () => {
    setMode('form');
  };

  const handleSave = async (input: NoteInput) => {
    if (selectedNote) {
      await update(selectedNote.id, input);
      setMode('detail');
    } else {
      const created = await create(input);
      setSelectedId(created.id);
      setMode('detail');
    }
  };

  const handleCancel = () => {
    setMode(selectedNote ? 'detail' : 'empty');
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    if (id === selectedId) {
      setSelectedId(null);
      setMode('empty');
    }
  };

  return (
    <main className="app">
      <div className="app-header">
        <h1>Notes</h1>
        <p className="app-subtitle">Private, local notes — nothing leaves your browser.</p>
      </div>
      {error && <p className="app-error">{error}</p>}

      <div className="app-layout">
        <section className="app-list-pane">
          <button type="button" className="btn-primary" onClick={handleNewNote}>
            + New note
          </button>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <NoteList
              notes={notes}
              selectedId={selectedId}
              onSelect={handleSelect}
              onDelete={handleDelete}
            />
          )}
        </section>

        <section className="app-form-pane">
          {mode === 'form' && (
            <NoteForm
              key={selectedNote?.id ?? 'new-note'}
              note={selectedNote}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
          {mode === 'detail' && selectedNote && (
            <NoteDetail note={selectedNote} onEdit={handleEdit} />
          )}
          {mode === 'empty' && (
            <p className="app-form-placeholder">
              Nothing selected. Choose a note on the left, or start a new one.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
