import { isDuplicateTag, isEmptyTag, normalizeTag } from '../tags';

describe('normalizeTag', () => {
  it('trims and lowercases', () => {
    expect(normalizeTag('  Work  ')).toBe('work');
  });
});

describe('isDuplicateTag', () => {
  it('detects a case-insensitive, whitespace-insensitive duplicate', () => {
    expect(isDuplicateTag(['Work'], ' work ')).toBe(true);
  });

  it('returns false for a genuinely new tag', () => {
    expect(isDuplicateTag(['Work'], 'Home')).toBe(false);
  });

  it('does not treat an empty candidate as a duplicate', () => {
    expect(isDuplicateTag(['Work'], '   ')).toBe(false);
  });
});

describe('isEmptyTag', () => {
  it('flags whitespace-only as empty', () => {
    expect(isEmptyTag('   ')).toBe(true);
  });

  it('does not flag a real tag as empty', () => {
    expect(isEmptyTag('work')).toBe(false);
  });
});