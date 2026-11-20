# Airport Search with Autocomplete

## Stack
**React 18 + TypeScript (Vite).** I chose React because I'm most comfortable with hooks, and
the feature maps cleanly onto small hooks (`useDebouncedValue`, `useAirportLookup`) plus one
controlled component.

## Run
Place the provided `airports.json` **unmodified** in `public/`, then:

```bash
npm install
npm run dev
```
Opens at http://localhost:5173

## Structure
- `src/airport-lookup.ts` – fetches `/airports.json` at runtime; pure `searchAirports()` + `useAirportLookup()` hook
- `src/use-debounced-value.ts` – generic debounce hook
- `src/airport-autocomplete.tsx` – input, state, keyboard handling
- `src/airport-dropdown.tsx` – presentational list (no state)
- `src/types.ts` – `Airport` type

## Questions

**How does your autocomplete avoid filtering on every keystroke, and why does that matter?**
The input value updates immediately (so typing feels instant), but filtering runs off a
debounced copy of that value (250 ms). Each keystroke resets a timer in `useDebouncedValue`,
so the search only runs once the user pauses. With 34 airports it's cheap, but the same
pattern prevents wasted work, re-renders and (with a remote API) a burst of network requests
and out-of-order responses.

**How is keyboard navigation kept in sync with mouse hover?**
There is a single source of truth: `activeIndex` in the parent component. Arrow keys change
it, and `onMouseEnter` on each item sets it too, so only one item is ever highlighted and
Enter always selects whichever item is highlighted, whether it got there via keyboard or
mouse. The input exposes it to assistive tech via `aria-activedescendant`.

**10,000 airports instead of 34 — what ONE change first?**
Move the search off the main path: build a pre-normalised (lowercased) index once on load
and/or search server-side with a prefix index, so each query doesn't lowercase and scan
10,000 records. Early exit at 5 results already helps, but a precomputed index (or a
backend `?q=` endpoint with `AbortController` cancelling stale requests) is the first thing
I'd do.

## Known limitations
- Results are in file order, not ranked (e.g. code-prefix matches aren't prioritised).
- Dropdown doesn't scroll the active item into view (not needed with max 5 items).
- No tests, minimal styling, no mobile/touch polish.
- Dropdown is hidden on blur; no screen-reader testing beyond basic ARIA roles.
