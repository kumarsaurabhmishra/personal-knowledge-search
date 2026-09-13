export interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInput {
  title: string;
  body: string;
  tags: string[];
  category?: string;
}

function validateTags(tags: string[]): void {
  if (tags.length === 0) {
    throw new Error('A note must have at least one tag.');
  }

  const normalizedTags = tags.map((tag) => tag.trim().toLowerCase());
  if (normalizedTags.some((tag) => tag.length === 0)) {
    throw new Error('Tags cannot be empty.');
  }

  if (new Set(normalizedTags).size !== normalizedTags.length) {
    throw new Error('Duplicate tags are not allowed.');
  }
}

export function createNote(input: NoteInput): Note {
  validateTags(input.tags);

  const now = new Date().toISOString();
  const category = input.category?.trim();

  return {
    id: crypto.randomUUID(),
    title: input.title,
    body: input.body,
    tags: [...input.tags],
    category: category ? category : undefined,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateNote(existing: Note, updates: Partial<NoteInput>): Note {
  const nextTags = updates.tags ?? existing.tags;
  validateTags(nextTags);

  const nextCategory =
    updates.category !== undefined ? updates.category.trim() || undefined : existing.category;

  return {
    ...existing,
    ...updates,
    tags: [...nextTags],
    category: nextCategory,
    updatedAt: new Date().toISOString(),
  };
}
