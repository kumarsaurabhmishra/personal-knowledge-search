import type { NoteInput } from './note';
import { normalizeTag } from './tags';

export interface NoteValidationErrors {
  title?: string;
  tags?: string;
}

export function validateNoteInput(input: NoteInput): NoteValidationErrors {
  const errors: NoteValidationErrors = {};

  if (input.title.trim().length === 0) {
    errors.title = 'Title is required.';
  }

  if (input.tags.length === 0) {
    errors.tags = 'At least one tag is required.';
  } else if (input.tags.some((t) => t.trim().length === 0)) {
    errors.tags = 'Tags cannot be empty.';
  } else {
    const normalized = input.tags.map(normalizeTag);
    const hasDuplicates = new Set(normalized).size !== normalized.length;
    if (hasDuplicates) {
      errors.tags = 'Duplicate tags are not allowed.';
    }
  }

  return errors;
}

export function isValid(errors: NoteValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}