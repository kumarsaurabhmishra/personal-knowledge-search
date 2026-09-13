import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Note } from '../../models/note';
import { NoteDetail } from '../NoteDetail';
import { NoteList } from '../NoteList';

const note: Note = {
  id: 'note-1',
  title: 'Project plan',
  body: 'Prepare the release plan.',
  tags: ['Work', 'Planning'],
  category: 'Projects',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

describe('note display', () => {
  it('shows category and tags on a note card', () => {
    render(
      <NoteList
        notes={[note]}
        selectedId={null}
        onSelect={jest.fn()}
        onDelete={jest.fn()}
      />,
    );

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Work, Planning')).toBeInTheDocument();
  });

  it('shows category and individual tags in the detail view', async () => {
    const onEdit = jest.fn();
    const user = userEvent.setup();
    render(<NoteDetail note={note} onEdit={onEdit} />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Planning')).toBeInTheDocument();
    expect(screen.getByText('Prepare the release plan.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
