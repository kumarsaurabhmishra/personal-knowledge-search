import { createNote, updateNote } from '../note';

describe('createNote', () => {
  it('creates a note with a generated id and timestamps', () => {
    const note = createNote({ title: 'Groceries', body: 'Milk, eggs', tags: ['home'] });

    expect(note.id).toBeTruthy();
    expect(note.title).toBe('Groceries');
    expect(note.body).toBe('Milk, eggs');
    expect(note.tags).toEqual(['home']);
    expect(note.createdAt).toBe(note.updatedAt);
  });

  it('generates a unique id per note', () => {
    const a = createNote({ title: 'A', body: '', tags: ['x'] });
    const b = createNote({ title: 'B', body: '', tags: ['x'] });
    expect(a.id).not.toBe(b.id);
  });

  it('throws when no tags are provided', () => {
    expect(() => createNote({ title: 'No tags', body: '', tags: [] })).toThrow(
      'A note must have at least one tag.',
    );
  });

  it('rejects empty and duplicate tags at the model boundary', () => {
    expect(() => createNote({ title: 'Empty', body: '', tags: ['   '] })).toThrow(
      'Tags cannot be empty.',
    );
    expect(() => createNote({ title: 'Duplicate', body: '', tags: ['Work', ' work '] })).toThrow(
      'Duplicate tags are not allowed.',
    );
  });
});

describe('updateNote', () => {
  it('updates fields and refreshes updatedAt, keeping id and createdAt', () => {
    const original = createNote({ title: 'Original', body: 'Body', tags: ['a'] });
    const updated = updateNote(original, { title: 'Edited' });

    expect(updated.id).toBe(original.id);
    expect(updated.createdAt).toBe(original.createdAt);
    expect(updated.title).toBe('Edited');
    expect(updated.body).toBe(original.body);
  });

  it('throws when updating to an empty tag list', () => {
    const original = createNote({ title: 'T', body: '', tags: ['a'] });
    expect(() => updateNote(original, { tags: [] })).toThrow(
      'A note must have at least one tag.',
    );
  });

  it('trims category and stores undefined for an empty category', () => {
    const withCategory = createNote({ title: 'A', body: '', tags: ['x'], category: '  Work  ' });
    expect(withCategory.category).toBe('Work');

    const withEmptyCategory = createNote({ title: 'A', body: '', tags: ['x'], category: '   ' });
    expect(withEmptyCategory.category).toBeUndefined();

    const withNoCategory = createNote({ title: 'A', body: '', tags: ['x'] });
    expect(withNoCategory.category).toBeUndefined();
  });
});
