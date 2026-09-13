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
