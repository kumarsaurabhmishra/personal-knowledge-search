import type { NoteInput } from './note';

export interface NoteValidationErrors {
  title?: string;
  tags?: string;
}

/**
 * Validates note input before it reaches storage. Returns an empty object
 * when valid. Body has no rules — a note can have empty body content.
 */
export function validateNoteInput(input: NoteInput): NoteValidationErrors {
  const errors: NoteValidationErrors = {};

  if (input.title.trim().length === 0) {
    errors.title = 'Title is required.';
  }

  if (input.tags.length === 0) {
    errors.tags = 'At least one tag is required.';
  }

  return errors;
}

export function isValid(errors: NoteValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}