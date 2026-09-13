import type { Note } from './note';
import { normalizeTag } from './tags';

export interface NoteFilters {
  tag: string;
  category: string;
}

function normalizeCategory(category: string): string {
  return category.trim().toLowerCase();
}

function uniqueSorted(values: string[], normalize: (value: string) => string): string[] {
  const unique = new Map<string, string>();
  values.forEach((value) => {
    const key = normalize(value);
    if (key && !unique.has(key)) unique.set(key, value.trim());
  });
  return [...unique.values()].sort((a, b) => a.localeCompare(b));
}

export function getAvailableTags(notes: Note[]): string[] {
  return uniqueSorted(notes.flatMap((note) => note.tags), normalizeTag);
}

export function getAvailableCategories(notes: Note[]): string[] {
  return uniqueSorted(
    notes.flatMap((note) => (note.category ? [note.category] : [])),
    normalizeCategory,
  );
}

export function filterNotes(notes: Note[], filters: NoteFilters): Note[] {
  const selectedTag = normalizeTag(filters.tag);
  const selectedCategory = normalizeCategory(filters.category);

  return notes.filter((note) => {
    const matchesTag =
      !selectedTag || note.tags.some((tag) => normalizeTag(tag) === selectedTag);
    const matchesCategory =
      !selectedCategory ||
      (note.category !== undefined && normalizeCategory(note.category) === selectedCategory);

    return matchesTag && matchesCategory;
  });
}
