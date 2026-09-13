import type { Note } from '../note';
import { normalizeSearchText, searchNotes } from '../noteSearch';

const notes: Note[] = [
  {
    id: '1',
    title: 'Project Release Plan',
    body: 'Prepare the production checklist.',
    tags: ['Work', 'Planning'],
    category: 'Projects',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Shopping list',
    body: 'Milk, eggs, and coffee beans',
    tags: ['Home', 'Errands'],
    category: 'Personal',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];

describe('normalizeSearchText', () => {
  it('normalizes case, surrounding whitespace, and repeated whitespace', () => {
    expect(normalizeSearchText('  Project\n   RELEASE  ')).toBe('project release');
  });
});

describe('searchNotes', () => {
  it('returns the original result set for an empty query', () => {
    expect(searchNotes(notes, '   ')).toBe(notes);
  });

  it('matches title text without case sensitivity', () => {
    expect(searchNotes(notes, 'release')).toEqual([notes[0]]);
  });

  it('matches normalized body text', () => {
    expect(searchNotes(notes, 'production   checklist')).toEqual([notes[0]]);
  });

  it('matches a tag without case sensitivity', () => {
    expect(searchNotes(notes, 'ERRANDS')).toEqual([notes[1]]);
  });

  it('returns an empty result when nothing matches', () => {
    expect(searchNotes(notes, 'missing')).toEqual([]);
  });
});
