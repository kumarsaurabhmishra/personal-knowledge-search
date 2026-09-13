import { useEffect, useRef } from 'react';

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
  const hasQuery = query.trim().length > 0;
  const hasReducedResults = resultCount !== totalCount;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;

      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    };

    document.addEventListener('keydown', focusSearch);
    return () => document.removeEventListener('keydown', focusSearch);
  }, []);

  return (
    <search className="note-search" aria-label="Search saved notes">
      <label htmlFor="note-search-input">Search notes</label>
      <div className="note-search-control">
        <input
          ref={inputRef}
          id="note-search-input"
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Title, body, or tag"
          autoComplete="off"
          aria-keyshortcuts="/ Escape"
          onKeyDown={(event) => {
            if (event.key === 'Escape' && hasQuery) {
              event.preventDefault();
              onClear();
            }
          }}
        />
        {hasQuery && (
          <button type="button" onClick={onClear} aria-label="Clear search">
            Clear
          </button>
        )}
      </div>
      <p className="note-search-status" aria-live="polite">
        {hasQuery || hasReducedResults
          ? `${resultCount} of ${totalCount} notes`
          : `${totalCount} notes`}
      </p>
    </search>
  );
}
