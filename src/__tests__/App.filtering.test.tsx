import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { useNotes } from '../hooks/useNotes';
import type { Note } from '../models/note';

jest.mock('../hooks/useNotes', () => ({
  useNotes: jest.fn(),
}));

const mockedUseNotes = jest.mocked(useNotes);

const notes: Note[] = [
  {
    id: '1',
    title: 'Release plan',
    body: '',
    tags: ['Work', 'Planning'],
    category: 'Projects',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Shopping list',
    body: '',
    tags: ['Home'],
    category: 'Personal',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Meeting notes',
    body: '',
    tags: ['work'],
    category: 'Meetings',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

beforeEach(() => {
  mockedUseNotes.mockReturnValue({
    notes,
    loading: false,
    error: null,
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  });
});

describe('App filtering interactions', () => {
  it('filters by tag and category together, then clears both filters', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText('Tag'), 'Work');
    expect(screen.getByText('Release plan')).toBeInTheDocument();
    expect(screen.getByText('Meeting notes')).toBeInTheDocument();
    expect(screen.queryByText('Shopping list')).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Category'), 'Projects');
    expect(screen.getByText('Release plan')).toBeInTheDocument();
    expect(screen.queryByText('Meeting notes')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.getByLabelText('Tag')).toHaveValue('');
    expect(screen.getByLabelText('Category')).toHaveValue('');
    expect(screen.getByText('Release plan')).toBeInTheDocument();
    expect(screen.getByText('Shopping list')).toBeInTheDocument();
    expect(screen.getByText('Meeting notes')).toBeInTheDocument();
  });

  it('shows a filter-specific empty state when no note matches', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText('Tag'), 'Home');
    await user.selectOptions(screen.getByLabelText('Category'), 'Projects');

    expect(screen.getByText('No notes match the selected filters.')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Shopping list')).not.toBeInTheDocument());
  });
});

describe('App search states', () => {
  it('treats whitespace-only input as an empty search', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Search notes' }), '   ');

    expect(screen.getByText('Release plan')).toBeInTheDocument();
    expect(screen.getByText('Shopping list')).toBeInTheDocument();
    expect(screen.getByText('Meeting notes')).toBeInTheDocument();
    expect(screen.getByText('3 notes')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('shows a search-specific empty state and restores notes when cleared', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Search notes' }), 'not present');

    expect(screen.getByText('No notes match your search.')).toBeInTheDocument();
    expect(screen.getByText('0 of 3 notes')).toBeInTheDocument();
    expect(screen.queryByText('Release plan')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(screen.getByText('Release plan')).toBeInTheDocument();
    expect(screen.getByText('Shopping list')).toBeInTheDocument();
    expect(screen.getByText('Meeting notes')).toBeInTheDocument();
    expect(screen.queryByText('No notes match your search.')).not.toBeInTheDocument();
  });
});
