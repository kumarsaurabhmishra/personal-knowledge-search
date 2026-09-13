import { useCallback, useEffect, useState } from 'react';
import type { Note, NoteInput } from '../models/note';
import { createNote, updateNote as applyUpdate } from '../models/note';
import { addNote, deleteNote as removeFromStore, getAllNotes, putNote } from '../storage/noteStore';

function sortByUpdatedDesc(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllNotes()
      .then((all) => setNotes(sortByUpdatedDesc(all)))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load notes'))
      .finally(() => setLoading(false));
  }, []);

  const create = useCallback(async (input: NoteInput): Promise<Note> => {
    const note = createNote(input);
    await addNote(note);
    setNotes((prev) => sortByUpdatedDesc([...prev, note]));
    return note;
  }, []);

  const update = useCallback(async (id: string, changes: Partial<NoteInput>): Promise<Note> => {
    setError(null);
    let updated!: Note;
    setNotes((prev) => {
      const existing = prev.find((n) => n.id === id);
      if (!existing) {
        throw new Error(`Note ${id} not found`);
      }
      updated = applyUpdate(existing, changes);
      return prev; // real replacement happens after the await below
    });
    await putNote(updated);
    setNotes((prev) => sortByUpdatedDesc(prev.map((n) => (n.id === id ? updated : n))));
    return updated;
  }, []);

  const remove = useCallback(async (id: string): Promise<void> => {
    await removeFromStore(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notes, loading, error, create, update, remove };
}