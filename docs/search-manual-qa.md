# Search Manual QA Checklist

Use this checklist before closing Story 3 or releasing a search-related change.

## Preparation

- [ ] Start the app with `npm run dev` and open the displayed local URL.
- [ ] Create at least three notes with different titles, body text, tags, and categories.
- [ ] Include mixed capitalization and multi-word text in the test data.

Suggested data:

| Note | Title | Body | Tags | Category |
| --- | --- | --- | --- | --- |
| 1 | Release Plan | Prepare the production checklist | Work, Planning | Projects |
| 2 | Shopping List | Buy milk and coffee beans | Home, Errands | Personal |
| 3 | Meeting Notes | Discuss the quarterly roadmap | Work | Meetings |

## Core search behavior

- [ ] Search `release` and confirm only **Release Plan** appears.
- [ ] Search `RELEASE` and confirm matching is case-insensitive.
- [ ] Search `production checklist` and confirm body text is searchable.
- [ ] Search `home` and confirm tags are searchable.
- [ ] Enter extra surrounding or repeated spaces and confirm matching still works.
- [ ] Search an unknown phrase and confirm **No notes match your search** appears.
- [ ] Confirm the live count changes to `0 of 3 notes` for no results.
- [ ] Clear the search and confirm all notes reappear.
- [ ] Enter only spaces and confirm all notes remain visible.

## Search and filter composition

- [ ] Select the **Work** tag and confirm only Work notes remain.
- [ ] Search `roadmap` and confirm only **Meeting Notes** remains.
- [ ] Select the **Projects** category and confirm the combined no-results state appears.
- [ ] Clear search while filters remain active and confirm the filtered list returns.
- [ ] Clear filters and confirm the complete note list returns.
- [ ] Confirm the result count reflects the visible filtered list.
- [ ] Open a note, hide it with search/filters, and confirm stale details are not displayed.
- [ ] Clear search/filters and confirm the selected note details return.

## Keyboard accessibility

- [ ] With focus outside a form control, press `/` and confirm search receives focus.
- [ ] Type a query, press `Escape`, and confirm it clears while focus stays in search.
- [ ] Navigate search, Clear, filters, note cards, and actions using only Tab/Shift+Tab.
- [ ] Confirm every focused interactive element has a visible focus indicator.
- [ ] Confirm Enter and Space activate focused buttons as expected.

## Responsive layout

- [ ] Test at a desktop width of at least 1024 px.
- [ ] Test near the 700 px stacking breakpoint.
- [ ] Test at a narrow mobile width around 375 px.
- [ ] Confirm there is no horizontal scrolling.
- [ ] Confirm controls remain readable and easy to tap.
- [ ] Confirm note cards, forms, tags, and detail content do not overlap.

## Persistence regression

- [ ] Create or edit a note, then refresh the page.
- [ ] Confirm the note, tags, and category remain available.
- [ ] Confirm search and filtering still work after refresh.
- [ ] Confirm a migrated legacy note can be viewed without an error.

## Completion record

- Tester:
- Date:
- Browser and version:
- Viewports tested:
- Result: Pass / Fail
- Notes or defects:
