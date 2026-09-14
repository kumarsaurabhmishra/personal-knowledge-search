import { useState } from 'react';
import type { Note } from '../models/note';
import { Icon } from './Icon';

interface NoteListProps {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export function NoteList({
  notes,
  selectedId,
  onSelect,
  onDelete,
  emptyMessage = 'No notes yet. Create your first one.',
}: NoteListProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  if (notes.length === 0) {
    return <p className="note-list-empty">{emptyMessage}</p>;
  }

  return (
    <ul className="note-list">
      {notes.map((note) => (
        <li
          key={note.id}
          className={note.id === selectedId ? 'note-list-item selected' : 'note-list-item'}
        >
          <button type="button" className="note-list-item-main" onClick={() => onSelect(note.id)}>
            <div className="note-list-item-heading">
              <span className="note-list-item-title">{note.title || '(untitled)'}</span>
              {note.category && (
                <span className="note-list-item-category">{note.category}</span>
              )}
            </div>
            <span className="note-list-item-tags">{note.tags.join(', ')}</span>
          </button>

          {confirmingId === note.id ? (
            <div className="note-list-item-confirm">
              <button
                type="button"
                className="btn-danger"
                onClick={() => {
                  onDelete(note.id);
                  setConfirmingId(null);
                }}
              >
                Really delete?
              </button>
              <button type="button" className="btn-text" onClick={() => setConfirmingId(null)}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-text note-list-item-delete"
              onClick={() => setConfirmingId(note.id)}
              aria-label={`Delete ${note.title || 'note'}`}
            >
              <Icon name="trash" /> <span className="note-list-delete-label">Delete</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
