import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';

// jsdom's test environment doesn't provide structuredClone, which
// fake-indexeddb needs internally. Our Note objects are plain JSON-safe
// data (strings, arrays, ISO date strings), so a JSON-based clone is a
// safe stand-in for tests.
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));
}