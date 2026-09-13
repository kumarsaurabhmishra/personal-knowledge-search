import type { Note } from '../note';
import {
  filterNotes,
  getAvailableCategories,
  getAvailableTags,
} from '../noteFilters';

const notes: Note[] = [
  {
    id: '1',
    title: 'Release plan',
    body: '',
    tags: ['Work', 'Planning'],
    category: 'Projects',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Shopping list',
    body: '',
    tags: ['Home'],
    category: 'Personal',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Meeting notes',
    body: '',
    tags: [' work '],
    category: ' projects ',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

describe('note filtering', () => {
  it('returns all notes when no filters are selected', () => {
    expect(filterNotes(notes, { tag: '', category: '' })).toEqual(notes);
  });

  it('filters tags without case or surrounding-whitespace sensitivity', () => {
    expect(filterNotes(notes, { tag: 'WORK', category: '' }).map((note) => note.id)).toEqual([
      '1',
      '3',
    ]);
  });

  it('filters categories without case or surrounding-whitespace sensitivity', () => {
    expect(filterNotes(notes, { tag: '', category: 'projects' }).map((note) => note.id)).toEqual([
      '1',
      '3',
    ]);
  });

  it('requires both filters to match when tag and category are selected', () => {
    expect(filterNotes(notes, { tag: 'Planning', category: 'Projects' })).toEqual([notes[0]]);
    expect(filterNotes(notes, { tag: 'Home', category: 'Projects' })).toEqual([]);
  });
});

describe('filter options', () => {
  it('returns sorted, normalized-unique display values', () => {
    expect(getAvailableTags(notes)).toEqual(['Home', 'Planning', 'Work']);
    expect(getAvailableCategories(notes)).toEqual(['Personal', 'Projects']);
  });
});
