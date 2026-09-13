import type { Note } from './note';

export function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function searchNotes(notes: Note[], query: string): Note[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return notes;

  return notes.filter((note) => {
    const searchableValues = [note.title, note.body, ...note.tags];
    return searchableValues.some((value) =>
      normalizeSearchText(value).includes(normalizedQuery),
    );
  });
}
