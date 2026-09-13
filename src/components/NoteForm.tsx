import { useState } from 'react';
import type { Note, NoteInput } from '../models/note';
import { validateNoteInput, isValid, type NoteValidationErrors } from '../models/validation';
import { isDuplicateTag, isEmptyTag } from '../models/tags';

interface NoteFormProps {
  note: Note | null;
  onSave: (input: NoteInput) => void;
  onCancel: () => void;
}

export function NoteForm({ note, onSave, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(note?.title ?? '');
  const [body, setBody] = useState(note?.body ?? '');
  const [tags, setTags] = useState<string[]>(note?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [tagInputError, setTagInputError] = useState<string | null>(null);
  const [category, setCategory] = useState(note?.category ?? '');
  const [errors, setErrors] = useState<NoteValidationErrors>({});

  const addTag = () => {
    if (isEmptyTag(tagInput)) {
      setTagInputError('Tag cannot be empty.');
      return;
    }
    if (isDuplicateTag(tags, tagInput)) {
      setTagInputError('That tag already exists on this note.');
      return;
    }
    setTags((prev) => [...prev, tagInput.trim()]);
    setTagInput('');
    setTagInputError(null);
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: NoteInput = {
      title: title.trim(),
      body,
      tags,
      category: category.trim() || undefined,
    };
    const validationErrors = validateNoteInput(input);
    setErrors(validationErrors);

    if (isValid(validationErrors)) {
      onSave(input);
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
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
      </div>

      <div className="form-field">
        <label htmlFor="note-category">Category</label>
        <input
          id="note-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Optional category"
        />
      </div>

      <div className="form-field">
        <label htmlFor="note-body">Body</label>
        <textarea
          id="note-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your note..."
          rows={10}
        />
      </div>

      <div className="form-field">
        <label htmlFor="note-tag-input">Tags</label>
        <div className="note-form-tag-input">
          <input
            id="note-tag-input"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value);
              if (tagInputError) setTagInputError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag"
            aria-invalid={Boolean(tagInputError || errors.tags)}
            aria-describedby={tagInputError || errors.tags ? 'note-tags-error' : undefined}
          />
          <button type="button" className="btn-secondary" onClick={addTag}>
            Add tag
          </button>
        </div>
        {(tagInputError || errors.tags) && (
          <p id="note-tags-error" className="note-form-error">
            {tagInputError || errors.tags}
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
      </div>

      <div className="note-form-actions">
        <button type="submit" className="btn-primary">
          {note ? 'Save changes' : 'Create note'}
        </button>
        <button type="button" className="btn-text" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
