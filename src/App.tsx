import { useMemo, useState } from 'react';
import './App.css';
import { NoteForm } from './components/NoteForm';
import { NoteList } from './components/NoteList';
import { useNotes } from './hooks/useNotes';

function App() {
  const { notes, loading, error, create, update, remove } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId],
  );

  const showForm = isCreating || selectedNote !== null;

  const handleSelect = (id: string) => {
    setIsCreating(false);
    setSelectedId(id);
  };

  const handleNewNote = () => {
    setSelectedId(null);
    setIsCreating(true);
  };

  const handleSave = async (input: { title: string; body: string; tags: string[] }) => {
    if (selectedNote) {
      await update(selectedNote.id, input);
    } else {
      const created = await create(input);
      setSelectedId(created.id);
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedId(null);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    if (id === selectedId) {
      setSelectedId(null);
    }
  };

  return (
    <main className="app">
      <h1>Notes</h1>
      {error && <p className="app-error">{error}</p>}

      <div className="app-layout">
        <section className="app-list-pane">
          <button type="button" onClick={handleNewNote}>
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
          {showForm ? (
            <NoteForm note={selectedNote} onSave={handleSave} onCancel={handleCancel} />
          ) : (
            <p className="app-form-placeholder">Select a note or create a new one.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;