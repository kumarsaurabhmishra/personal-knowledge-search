import { createNote, updateNote } from '../../models/note';
import { resetDbConnectionForTests } from '../db';
import { addNote, deleteNote, getAllNotes, getNote, putNote } from '../noteStore';

beforeEach(async () => {
  await resetDbConnectionForTests();
  const dbs = await indexedDB.databases();
  await Promise.all(
    dbs.map(
      (db) =>
        db.name &&
        new Promise((resolve) => {
          const req = indexedDB.deleteDatabase(db.name!);
          req.onsuccess = () => resolve(undefined);
          req.onerror = () => resolve(undefined);
        }),
    ),
  );
});

describe('noteStore', () => {
  it('saves a note and retrieves it by id', async () => {
    const note = createNote({ title: 'Groceries', body: 'Milk', tags: ['home'] });
    await addNote(note);

    const found = await getNote(note.id);
    expect(found).toEqual(note);
  });

  it('returns all saved notes', async () => {
    const a = createNote({ title: 'A', body: '', tags: ['x'] });
    const b = createNote({ title: 'B', body: '', tags: ['y'] });
    await addNote(a);
    await addNote(b);

    const all = await getAllNotes();
    expect(all).toHaveLength(2);
    expect(all.map((n) => n.id).sort()).toEqual([a.id, b.id].sort());
  });

  it('updates an existing note in place', async () => {
    const note = createNote({ title: 'Original', body: '', tags: ['a'] });
    await addNote(note);

    const edited = updateNote(note, { title: 'Edited' });
    await putNote(edited);

    const found = await getNote(note.id);
    expect(found?.title).toBe('Edited');

    const all = await getAllNotes();
    expect(all).toHaveLength(1); // put() replaced, didn't duplicate
  });

  it('deletes a note', async () => {
    const note = createNote({ title: 'Temp', body: '', tags: ['a'] });
    await addNote(note);
    await deleteNote(note.id);

    const found = await getNote(note.id);
    expect(found).toBeUndefined();
  });

  it('persists data across a simulated refresh (new db connection)', async () => {
    const note = createNote({ title: 'Survives refresh', body: '', tags: ['a'] });
    await addNote(note);

    // Simulate "refreshing the app" by dropping the cached connection
    // and reopening — this is what a real page reload does.
    resetDbConnectionForTests();

    const found = await getNote(note.id);
    expect(found?.title).toBe('Survives refresh');
  });
});