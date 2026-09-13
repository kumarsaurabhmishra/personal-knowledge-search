import { useMemo, useState } from 'react';
import './App.css';
import { NoteForm } from './components/NoteForm';
import { NoteList } from './components/NoteList';
import { NoteDetail } from './components/NoteDetail';
import { NoteFilters } from './components/NoteFilters';
import { useNotes } from './hooks/useNotes';
import type { NoteInput } from './models/note';
import {
  filterNotes,
  getAvailableCategories,
  getAvailableTags,
} from './models/noteFilters';

type ViewMode = 'empty' | 'detail' | 'form';

function App() {
  const { notes, loading, error, create, update, remove } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<ViewMode>('empty');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId],
  );

  const availableTags = useMemo(() => getAvailableTags(notes), [notes]);
  const availableCategories = useMemo(() => getAvailableCategories(notes), [notes]);
  const filteredNotes = useMemo(
    () => filterNotes(notes, { tag: selectedTag, category: selectedCategory }),
    [notes, selectedTag, selectedCategory],
  );
  const hasActiveFilter = Boolean(selectedTag || selectedCategory);

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
          <NoteFilters
            tags={availableTags}
            categories={availableCategories}
            selectedTag={selectedTag}
            selectedCategory={selectedCategory}
            onTagChange={setSelectedTag}
            onCategoryChange={setSelectedCategory}
            onClear={() => {
              setSelectedTag('');
              setSelectedCategory('');
            }}
          />
          {loading ? (
            <p>Loading...</p>
          ) : (
            <NoteList
              notes={filteredNotes}
              selectedId={selectedId}
              onSelect={handleSelect}
              onDelete={handleDelete}
              emptyMessage={
                hasActiveFilter
                  ? 'No notes match the selected filters.'
                  : 'No notes yet. Create your first one.'
              }
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
