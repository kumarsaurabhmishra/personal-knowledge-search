# Notes

A private, local-only notes app: capture, organize, and reliably retrieve
personal notes. No accounts, no sync, no uploads — everything lives in your
browser's IndexedDB.

## Stack

- React + TypeScript
- Vite (dev server / build)
- IndexedDB for persistence (survives refresh)
- Jest + React Testing Library for tests
- ESLint for linting

## Getting started

```bash
npm install
npm run dev         # start the dev server
npm run build       # type-check and build for production
npm run lint        # lint the codebase
npm test            # run the test suite once
npm run test:watch  # run tests in watch mode
```

## Project structure

```text
src/
├── components/  # Note form, list, detail, and filtering controls
├── hooks/       # useNotes state and storage wiring
├── models/      # Note model, tag utilities, filtering, and validation
└── storage/     # IndexedDB persistence and schema upgrades
```

## Features

- Create, view, edit, and delete notes
- Add and remove tags while creating or editing a note
- Assign an optional category to each note
- View tags and categories on note cards and note details
- Filter notes by tag, category, or both together
- Enter and clear a search query using the saved-notes search control
- Search note titles, body text, and tags with normalized matching
- Clear active filters and return to the complete note list
- Reject empty and duplicate tags using case-insensitive comparison
- Notes persist in the browser's IndexedDB and survive a page refresh
- Existing notes are migrated safely when the IndexedDB schema is upgraded
- Inline validation: title and at least one tag are required
- Inline delete confirmation (no browser confirm dialogs)

## Organizing and filtering notes

1. Create or edit a note.
2. Enter a tag and select **Add tag**, or press Enter.
3. Add an optional category and save the note.
4. Use the **Filter notes** card above the note list to select a tag, a
   category, or both.
5. Select **Clear** to remove all active filters.

Keyboard shortcuts:

- Press `/` outside a form field to focus the search box.
- Press `Escape` in the search box to clear an active query.

Tag and category matching ignores capitalization and surrounding whitespace.
When both filters are selected, a note must match both values.

## Scope

This is an MVP focused on: note capture, organization (tags), and reliable
retrieval after refresh. Explicitly out of scope: accounts, sync, file
uploads, OCR, AI-powered search, sharing, reminders, and deployment.

Note: tags are stored with a multi-entry IndexedDB index. Full-text search is a
separate future story.

## Testing

61 tests across the model, validation, storage, filtering, search, and UI layers,
including:

- Note creation/update rules (id generation, tag requirement, timestamps)
- Input validation (empty title, empty tags, valid input)
- IndexedDB CRUD operations, including a simulated app-refresh scenario
- IndexedDB migration of notes created before tags were introduced
- Form validation UX (inline errors, blocked save, error clearing)
- Tag normalization, duplicate detection, and filtering combinations
- Tag and category rendering on note cards and detail views
- User-level tag/category selection, combined filtering, clearing, and empty states
- Search-input query, result-count, and clear interactions
- Normalized title, body, and tag search matching
- Empty-search, no-results, and clear-to-restore application states
- Search keyboard focus and Escape-to-clear behavior
- Application-level title, body, tag, and combined search/filter interactions
- Filter-aware result counts and selected-detail visibility regression coverage

For release-level browser checks, follow the
[Search Manual QA Checklist](docs/search-manual-qa.md).

## Status

- [x] Project scaffold, linting, test runner
- [x] Note model
- [x] IndexedDB persistence layer
- [x] Create / view / edit / delete UI
- [x] CRUD validation + tests
- [x] Tag and optional category fields
- [x] Tag entry, removal, and display
- [x] Tag and category filtering
- [x] Complete Story 2 filtering interaction tests
- [x] Story 3 Task 1: search input and results state
- [x] Story 3 Task 2: normalized title, body, and tag matching
- [x] Story 3 Task 3: empty-search and no-results states
- [x] Story 3 Task 4: responsive layout and keyboard accessibility
- [x] Story 3 Task 5: search tests and manual QA checklist
