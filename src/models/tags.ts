/**
 * Normalizes a tag for comparison purposes only (dedup, filtering).
 * Display should always use the original, non-normalized tag string.
 */
export function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

export function isDuplicateTag(existingTags: string[], candidate: string): boolean {
  const normalized = normalizeTag(candidate);
  if (normalized.length === 0) return false; // empty isn't a "duplicate", it's just invalid
  return existingTags.some((t) => normalizeTag(t) === normalized);
}

export function isEmptyTag(candidate: string): boolean {
  return normalizeTag(candidate).length === 0;
}