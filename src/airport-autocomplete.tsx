import { useEffect, useId, useMemo, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Airport } from './types';
import { useAirportLookup } from './airport-lookup';
import { useDebouncedValue } from './use-debounced-value';
import { AirportDropdown } from './airport-dropdown';

const DEBOUNCE_MS = 250;


interface Props {
  onSelect: (airport: Airport) => void;
}

export function AirportAutocomplete({ onSelect }: Props) {
  const { search, loading, error } = useAirportLookup();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputId = useId();
  const listId = useId();

  const debounced = useDebouncedValue(value, DEBOUNCE_MS);
  const results = useMemo(() => search(debounced), [search, debounced]);

  // New result set -> no item is focused.
  useEffect(() => setActiveIndex(-1), [results]);

  // Hide when empty (immediately), and don't flash "No matches" before the
  // first debounced search has run.
  const showList = open && value.trim() !== '' && debounced.trim() !== '';

  const select = (airport: Airport) => {
    setValue(airport.code);
    setOpen(false);
    onSelect(airport);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const count = results.length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!showList) setOpen(true);
        else if (count) setActiveIndex((i) => (i + 1) % count);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (showList && count) setActiveIndex((i) => (i <= 0 ? count - 1 : i - 1));
        break;
      case 'Enter':
        if (showList && results[activeIndex]) {
          e.preventDefault();
          select(results[activeIndex]);
        }
        break;
      case 'Escape':
        setOpen(false); // value is left untouched
        break;
    }
  };

  return (
    <div className="autocomplete">
      <label htmlFor={inputId}>From</label>
      <input
        id={inputId}
        type="text"
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
        value={value}
        placeholder="Code or city, e.g. BLR or Pune"
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (value.trim() !== '') setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => setOpen(false)}
      />
      {showList && (
        <AirportDropdown
          id={listId}
          results={results}
          activeIndex={activeIndex}
          loading={loading}
          error={error}
          onHover={setActiveIndex}
          onSelect={select}
        />
      )}
    </div>
  );
}
