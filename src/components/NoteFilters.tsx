interface NoteFiltersProps {
  tags: string[];
  categories: string[];
  selectedTag: string;
  selectedCategory: string;
  onTagChange: (tag: string) => void;
  onCategoryChange: (category: string) => void;
  onClear: () => void;
}

export function NoteFilters({
  tags,
  categories,
  selectedTag,
  selectedCategory,
  onTagChange,
  onCategoryChange,
  onClear,
}: NoteFiltersProps) {
  const hasActiveFilter = Boolean(selectedTag || selectedCategory);

  if (tags.length === 0 && categories.length === 0) return null;

  return (
    <section className="note-filters" aria-labelledby="note-filters-title">
      <div className="note-filters-header">
        <h2 id="note-filters-title">Filter notes</h2>
        {hasActiveFilter && (
          <button type="button" className="note-filter-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      <div className="note-filter-fields">
        <div className="note-filter-field">
          <label htmlFor="note-filter-tag">Tag</label>
          <select
            id="note-filter-tag"
            value={selectedTag}
            onChange={(event) => onTagChange(event.target.value)}
          >
            <option value="">All tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="note-filter-field">
          <label htmlFor="note-filter-category">Category</label>
          <select
            id="note-filter-category"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
