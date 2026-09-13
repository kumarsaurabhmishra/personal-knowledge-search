import { useEffect, useState } from 'react';
import type { Note, NoteInput } from '../models/note';
import { validateNoteInput, isValid, type NoteValidationErrors } from '../models/validation';

interface NoteFormProps {
  note: Note | null; // null = creating a new note
  onSave: (input: NoteInput) => void;
  onCancel: () => void;
}

export function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<NoteValidationErrors>({});

  // Reset form fields whenever the selected note changes (including
  // switching to "create new" via note === null).
  useEffect(() => {
    setTitle(note?.title ?? '');
    setBody(note?.body ?? '');
    setTags(note?.tags ?? []);
    setTagInput('');
    setErrors({});
  }, [note]);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: NoteInput = { title: title.trim(), body, tags };
    const validationErrors = validateNoteInput(input);
    setErrors(validationErrors);

    if (isValid(validationErrors)) {
      onSave(input);
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="note-title">Title</label>
      <input
        id="note-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        aria-invalid={Boolean(errors.title)}
        aria-describedby={errors.title ? 'note-title-error' : undefined}
      />
      {errors.title && (
        <p id="note-title-error" className="note-form-error">
          {errors.title}
        </p>
      )}

      <label htmlFor="note-body">Body</label>
      <textarea
        id="note-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your note..."
        rows={10}
      />

      <label htmlFor="note-tag-input">Tags</label>
      <div className="note-form-tag-input">
        <input
          id="note-tag-input"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Add a tag"
          aria-invalid={Boolean(errors.tags)}
          aria-describedby={errors.tags ? 'note-tags-error' : undefined}
        />
        <button type="button" onClick={addTag}>
          Add tag
        </button>
      </div>
      {errors.tags && (
        <p id="note-tags-error" className="note-form-error">
          {errors.tags}
        </p>
      )}

      <ul className="note-form-tags">
        {tags.map((tag) => (
          <li key={tag}>
            {tag}
            <button type="button" aria-label={`Remove tag ${tag}`} onClick={() => removeTag(tag)}>
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="note-form-actions">
        <button type="submit">{note ? 'Save changes' : 'Create note'}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}