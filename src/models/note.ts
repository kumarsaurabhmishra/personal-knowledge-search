export interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[]; // enforced non-empty at creation — see createNote()
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface NoteInput {
  title: string;
  body: string;
  tags: string[];
}

/**
 * Creates a new Note from user input.
 * Throws if tags is empty — a note must have at least one tag.
 * Deeper validation (empty title, whitespace-only body, etc.) belongs
 * to the CRUD validation layer (Task 5), not the model itself.
 */
export function createNote(input: NoteInput): Note {
  if (input.tags.length === 0) {
    throw new Error('A note must have at least one tag.');
  }

  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: input.title,
    body: input.body,
    tags: [...input.tags],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Returns a new Note with the given fields updated and updatedAt refreshed.
 * createdAt and id are immutable and always preserved.
 */
export function updateNote(existing: Note, updates: Partial<NoteInput>): Note {
  const nextTags = updates.tags ?? existing.tags;

  if (nextTags.length === 0) {
    throw new Error('A note must have at least one tag.');
  }

  return {
    ...existing,
    ...updates,
    tags: [...nextTags],
    updatedAt: new Date().toISOString(),
  };
}