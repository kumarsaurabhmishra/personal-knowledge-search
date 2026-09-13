import type { Note } from '../models/note';

interface NoteDetailProps {
  note: Note;
  onEdit: () => void;
}

export function NoteDetail({ note, onEdit }: NoteDetailProps) {
  return (
    <article className="note-detail">
      <div className="note-detail-header">
        <h2>{note.title || '(untitled)'}</h2>
        <button type="button" className="btn-secondary" onClick={onEdit}>
          Edit
        </button>
      </div>

      {note.category && (
        <div className="note-detail-section">
          <span className="note-detail-label">Category</span>
          <span className="note-detail-category">{note.category}</span>
        </div>
      )}

      <div className="note-detail-section">
        <span className="note-detail-label">Tags</span>
        <ul className="note-detail-tags">
          {note.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>

      <p className="note-detail-body">{note.body}</p>

      <p className="note-detail-meta">Updated {new Date(note.updatedAt).toLocaleString()}</p>
    </article>
  );
}