import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteForm } from '../NoteForm';

describe('NoteForm validation', () => {
  it('shows an error and does not save when title is empty', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();
    render(<NoteForm note={null} onSave={onSave} onCancel={jest.fn()} />);

    // Add a tag but leave title empty
    await user.type(screen.getByLabelText(/tags/i), 'home');
    await user.click(screen.getByRole('button', { name: /add tag/i }));
    await user.click(screen.getByRole('button', { name: /create note/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('shows an error and does not save when there are no tags', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();
    render(<NoteForm note={null} onSave={onSave} onCancel={jest.fn()} />);

    await user.type(screen.getByLabelText(/title/i), 'Groceries');
    await user.click(screen.getByRole('button', { name: /create note/i }));

    expect(await screen.findByText(/at least one tag is required/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('saves successfully once title and at least one tag are provided', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();
    render(<NoteForm note={null} onSave={onSave} onCancel={jest.fn()} />);

    await user.type(screen.getByLabelText(/title/i), 'Groceries');
    await user.type(screen.getByLabelText(/^tags$/i), 'home');
    await user.click(screen.getByRole('button', { name: /add tag/i }));
    await user.click(screen.getByRole('button', { name: /create note/i }));

    expect(onSave).toHaveBeenCalledWith({
      title: 'Groceries',
      body: '',
      tags: ['home'],
      category: undefined,
    });
  });

  it('clears a previous error once the field becomes valid and resubmitted', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();
    render(<NoteForm note={null} onSave={onSave} onCancel={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /create note/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/title/i), 'Groceries');
    await user.type(screen.getByLabelText(/tags/i), 'home');
    await user.click(screen.getByRole('button', { name: /add tag/i }));
    await user.click(screen.getByRole('button', { name: /create note/i }));

    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
    expect(onSave).toHaveBeenCalled();
  });

  it('shows an error and does not add a duplicate tag (case-insensitive)', async () => {
    const user = userEvent.setup();
    render(<NoteForm note={null} onSave={jest.fn()} onCancel={jest.fn()} />);

    const tagInput = screen.getByLabelText('Tags');
    await user.type(tagInput, 'Work');
    await user.click(screen.getByRole('button', { name: /add tag/i }));
    await user.type(tagInput, ' work ');
    await user.click(screen.getByRole('button', { name: /add tag/i }));

    expect(await screen.findByText(/already exists/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1); // only one tag chip
  });

  it('shows an error and does not add an empty tag', async () => {
    const user = userEvent.setup();
    render(<NoteForm note={null} onSave={jest.fn()} onCancel={jest.fn()} />);

    await user.click(screen.getByRole('button', { name: /add tag/i }));

    expect(await screen.findByText(/tag cannot be empty/i)).toBeInTheDocument();
  });
});
