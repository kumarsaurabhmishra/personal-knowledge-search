import { isValid, validateNoteInput } from '../validation';

describe('validateNoteInput', () => {
  it('returns no errors for valid input', () => {
    const errors = validateNoteInput({ title: 'Groceries', body: '', tags: ['home'] });
    expect(errors).toEqual({});
    expect(isValid(errors)).toBe(true);
  });

  it('flags an empty title', () => {
    const errors = validateNoteInput({ title: '', body: 'some body', tags: ['home'] });
    expect(errors.title).toBe('Title is required.');
    expect(isValid(errors)).toBe(false);
  });

  it('flags a whitespace-only title', () => {
    const errors = validateNoteInput({ title: '   ', body: '', tags: ['home'] });
    expect(errors.title).toBe('Title is required.');
  });

  it('flags zero tags', () => {
    const errors = validateNoteInput({ title: 'Groceries', body: '', tags: [] });
    expect(errors.tags).toBe('At least one tag is required.');
  });

  it('allows an empty body', () => {
    const errors = validateNoteInput({ title: 'Groceries', body: '', tags: ['home'] });
    expect(errors.title).toBeUndefined();
  });

  it('flags both title and tags at once', () => {
    const errors = validateNoteInput({ title: '', body: '', tags: [] });
    expect(errors).toEqual({
      title: 'Title is required.',
      tags: 'At least one tag is required.',
    });
  });

  it('flags an empty tag in the list', () => {
  const errors = validateNoteInput({ title: 'A', body: '', tags: ['work', '   '] });
  expect(errors.tags).toBe('Tags cannot be empty.');
});

it('flags case-insensitive duplicate tags', () => {
  const errors = validateNoteInput({ title: 'A', body: '', tags: ['Work', 'work'] });
  expect(errors.tags).toBe('Duplicate tags are not allowed.');
});
});