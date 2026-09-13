interface NoteSearchProps {
  query: string;
  resultCount: number;
  totalCount: number;
  onQueryChange: (query: string) => void;
  onClear: () => void;
}

export function NoteSearch({
  query,
  resultCount,
  totalCount,
  onQueryChange,
  onClear,
}: NoteSearchProps) {
  const hasQuery = query.length > 0;

  return (
    <search className="note-search" aria-label="Search saved notes">
      <label htmlFor="note-search-input">Search notes</label>
      <div className="note-search-control">
        <input
          id="note-search-input"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Title, body, or tag"
          autoComplete="off"
        />
        {hasQuery && (
          <button type="button" onClick={onClear} aria-label="Clear search">
            Clear
          </button>
        )}
      </div>
      <p className="note-search-status" aria-live="polite">
        {hasQuery ? `${resultCount} of ${totalCount} notes` : `${totalCount} notes`}
      </p>
    </search>
  );
}
