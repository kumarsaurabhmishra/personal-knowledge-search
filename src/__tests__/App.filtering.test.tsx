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
    body: 'Prepare the production checklist.',
    tags: ['Work', 'Planning'],
    category: 'Projects',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Shopping list',
    body: 'Buy milk and coffee beans.',
    tags: ['Home'],
    category: 'Personal',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Meeting notes',
    body: 'Discuss the quarterly roadmap.',
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
    expect(screen.getByText('1 of 3 notes')).toBeInTheDocument();

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

  it('hides stale note details when the selected note is filtered out', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Meeting notes Meetings Work/i }));
    expect(screen.getByRole('heading', { name: 'Meeting notes' })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Tag'), 'Home');

    expect(screen.queryByRole('heading', { name: 'Meeting notes' })).not.toBeInTheDocument();
    expect(
      screen.getByText('The selected note is hidden by your current search or filters.'),
    ).toBeInTheDocument();
  });

  it('restores selected-note details when filters are cleared', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /Meeting notes Meetings Work/i }));
    await user.selectOptions(screen.getByLabelText('Tag'), 'Home');
    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByRole('heading', { name: 'Meeting notes' })).toBeInTheDocument();
  });
});

describe('App search states', () => {
  it.each([
    ['title', 'RELEASE', 'Release plan'],
    ['body', 'production   checklist', 'Release plan'],
    ['tag', 'home', 'Shopping list'],
  ])('finds a note by normalized %s text', async (_field, query, expectedTitle) => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByRole('searchbox', { name: 'Search notes' }), query);

    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
    expect(screen.getByText('1 of 3 notes')).toBeInTheDocument();
  });

  it('composes search with active tag and category filters', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText('Tag'), 'Work');
    await user.selectOptions(screen.getByLabelText('Category'), 'Meetings');
    await user.type(screen.getByRole('searchbox', { name: 'Search notes' }), 'roadmap');

    expect(screen.getByText('Meeting notes')).toBeInTheDocument();
    expect(screen.queryByText('Release plan')).not.toBeInTheDocument();
    expect(screen.getByText('1 of 3 notes')).toBeInTheDocument();
  });

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
