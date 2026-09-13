import { useState } from 'react';
import type { Note } from '../models/note';

interface NoteListProps {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NoteList({ notes, selectedId, onSelect, onDelete }: NoteListProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (notes.length === 0) {
    return <p className="note-list-empty">No notes yet. Create your first one.</p>;
  }

  return (
    <ul className="note-list">
      {notes.map((note) => (
        <li
          key={note.id}
          className={note.id === selectedId ? 'note-list-item selected' : 'note-list-item'}
        >
          <button
            type="button"
            className="note-list-item-main"
            onClick={() => onSelect(note.id)}
          >
            <span className="note-list-item-title">{note.title || '(untitled)'}</span>
            <span className="note-list-item-tags">{note.tags.join(', ')}</span>
          </button>

          {confirmingId === note.id ? (
            <div className="note-list-item-confirm">
              <button
                type="button"
                onClick={() => {
                  onDelete(note.id);
                  setConfirmingId(null);
                }}
              >
                Really delete?
              </button>
              <button type="button" onClick={() => setConfirmingId(null)}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="note-list-item-delete"
              onClick={() => setConfirmingId(note.id)}
              aria-label={`Delete ${note.title || 'note'}`}
            >
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}