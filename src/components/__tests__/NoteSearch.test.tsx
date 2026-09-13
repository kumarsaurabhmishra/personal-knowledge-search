import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteSearch } from '../NoteSearch';

function SearchHarness() {
  const [query, setQuery] = useState('');
  return (
    <NoteSearch
      query={query}
      resultCount={query ? 2 : 3}
      totalCount={3}
      onQueryChange={setQuery}
      onClear={() => setQuery('')}
    />
  );
}

describe('NoteSearch', () => {
  it('captures a search query and exposes the current result count', async () => {
    const user = userEvent.setup();
    render(<SearchHarness />);

    await user.type(screen.getByRole('searchbox', { name: 'Search notes' }), 'project');

    expect(screen.getByRole('searchbox', { name: 'Search notes' })).toHaveValue('project');
    expect(screen.getByText('2 of 3 notes')).toBeInTheDocument();
  });

  it('clears the current query', async () => {
    const user = userEvent.setup();
    render(<SearchHarness />);

    const searchbox = screen.getByRole('searchbox', { name: 'Search notes' });
    await user.type(searchbox, 'project');
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(searchbox).toHaveValue('');
    expect(screen.getByText('3 notes')).toBeInTheDocument();
  });
});
