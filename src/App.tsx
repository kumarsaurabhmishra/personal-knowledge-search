import { useMemo, useState } from 'react';
import './App.css';
import { NoteForm } from './components/NoteForm';
import { NoteList } from './components/NoteList';
import { NoteDetail } from './components/NoteDetail';
import { NoteFilters } from './components/NoteFilters';
import { NoteSearch } from './components/NoteSearch';
import { Icon } from './components/Icon';
import { useNotes } from './hooks/useNotes';
import type { NoteInput } from './models/note';
import {
  filterNotes,
  getAvailableCategories,
  getAvailableTags,
} from './models/noteFilters';
import { searchNotes } from './models/noteSearch';

type ViewMode = 'empty' | 'detail' | 'form';

function App() {
  const { notes, loading, error, create, update, remove } = useNotes();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<ViewMode>('empty');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
  const searchResults = useMemo(
    () => searchNotes(filteredNotes, searchQuery),
    [filteredNotes, searchQuery],
  );
  const isSelectedNoteVisible =
    selectedNote !== null && searchResults.some((note) => note.id === selectedNote.id);
  const hasActiveFilter = Boolean(selectedTag || selectedCategory);
  const hasActiveSearch = searchQuery.trim().length > 0;

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

  const handleBackToNotes = () => {
    setSelectedId(null);
    setMode('empty');
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    if (id === selectedId) {
      setSelectedId(null);
      setMode('empty');
    }
  };

  return (
    <main className={`app ${mode !== 'empty' ? 'app-workspace-open' : ''}`}>
      <div className="app-header">
        <div className="app-heading">
          <span className="app-eyebrow">Personal knowledge</span>
          <h1>Notes</h1>
          <p className="app-subtitle">A quiet place for everything worth remembering.</p>
        </div>
        <button type="button" className="btn-primary app-new-note" onClick={handleNewNote}>
          <Icon name="add" /> New note
        </button>
      </div>
      {error && <p className="app-error">{error}</p>}

      <section className="app-discovery" aria-label="Find and filter notes">
        <NoteSearch
          query={searchQuery}
          resultCount={searchResults.length}
          totalCount={notes.length}
          onQueryChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
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
      </section>

      <div className={`app-layout ${mode !== 'empty' ? 'has-workspace' : ''}`}>
        <section className="app-list-pane">
          <div className="app-pane-heading">
            <h2>Your notes</h2>
            <span>{searchResults.length}</span>
          </div>
          {loading ? (
            <p className="app-loading">Loading notes…</p>
          ) : (
            <NoteList
              notes={searchResults}
              selectedId={selectedId}
              onSelect={handleSelect}
              onDelete={handleDelete}
              emptyMessage={
                hasActiveSearch && hasActiveFilter
                  ? 'No notes match your search and selected filters.'
                  : hasActiveSearch
                    ? 'No notes match your search.'
                    : hasActiveFilter
                      ? 'No notes match the selected filters.'
                      : 'No notes yet. Create your first one.'
              }
            />
          )}
        </section>

        <section className="app-form-pane" aria-label="Note workspace">
          {mode !== 'empty' && (
            <button type="button" className="btn-text app-mobile-back" onClick={handleBackToNotes}>
              <Icon name="arrow-left" /> All notes
            </button>
          )}
          {mode === 'form' && (
            <NoteForm
              key={selectedNote?.id ?? 'new-note'}
              note={selectedNote}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
          {mode === 'detail' && selectedNote && isSelectedNoteVisible && (
            <NoteDetail note={selectedNote} onEdit={handleEdit} />
          )}
          {mode === 'detail' && selectedNote && !isSelectedNoteVisible && (
            <p className="app-form-placeholder">
              The selected note is hidden by your current search or filters.
            </p>
          )}
          {mode === 'empty' && (
            <div className="app-empty-workspace">
              <span aria-hidden="true">✦</span>
              <h2>Select a note</h2>
              <p>Choose something from your list, or create a new note.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
