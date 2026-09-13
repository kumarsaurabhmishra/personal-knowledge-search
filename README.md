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
npm run dev        # start the dev server
npm run build       # type-check and build for production
npm run lint         # lint the codebase
npm test              # run the test suite once
npm run test:watch    # run tests in watch mode
```

## Project structure

src/
models/ # Note data model, validation
storage/ # IndexedDB persistence layer
hooks/ # useNotes — state + storage wiring for the UI
components/ # NoteList, NoteForm
tests/ # App-level tests (each folder above has its own tests too)

## Features

- Create, view, edit, and delete notes
- Tag notes (at least one tag required per note)
- Notes persist in the browser's IndexedDB and survive a page refresh
- Inline validation: title is required, at least one tag is required
- Inline delete confirmation (no browser confirm dialogs)

## Scope

This is an MVP focused on: note capture, organization (tags), and reliable
retrieval after refresh. Explicitly out of scope: accounts, sync, file
uploads, OCR, AI-powered search, sharing, reminders, and deployment.

Note: tags are stored with a multi-entry IndexedDB index to support
keyword/tag search, but the search UI itself is a separate, future story.

## Testing

21 tests across the model, validation, storage, and UI layers, including:

- Note creation/update rules (id generation, tag requirement, timestamps)
- Input validation (empty title, empty tags, valid input)
- IndexedDB CRUD operations, including a simulated app-refresh scenario
- Form validation UX (inline errors, blocked save, error clearing)

## Status

- [x] Project scaffold, linting, test runner
- [x] Note model
- [x] IndexedDB persistence layer
- [x] Create / view / edit / delete UI
- [x] CRUD validation + tests
