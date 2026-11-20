import type { Airport } from './types';

interface Props {
  id: string;
  results: Airport[];
  activeIndex: number;
  loading: boolean;
  error: string | null;
  onHover: (index: number) => void;
  onSelect: (airport: Airport) => void;
}

/** Presentational only: renders the list, owns no state. */
export function AirportDropdown({
  id,
  results,
  activeIndex,
  loading,
  error,
  onHover,
  onSelect,
}: Props) {
  if (error || loading || results.length === 0) {
    const message = error ?? (loading ? 'Loading airports…' : 'No airports match');
    return (
      <ul className="dropdown" id={id} role="listbox">
        <li className="dropdown__empty" role="option" aria-disabled="true" aria-selected="false">
          {message}
        </li>
      </ul>
    );
  }

  return (
    <ul className="dropdown" id={id} role="listbox">
      {results.map((a, i) => (
        <li
          key={a.code}
          id={`${id}-opt-${i}`}
          role="option"
          aria-selected={i === activeIndex}
          className={'dropdown__item' + (i === activeIndex ? ' dropdown__item--active' : '')}
          onMouseEnter={() => onHover(i)}
          onMouseDown={(e) => e.preventDefault()} // keep focus in the input
          onClick={() => onSelect(a)}
        >
          <strong>{a.code}</strong> — {a.city}, {a.country}
          <div className="dropdown__name">{a.name}</div>
        </li>
      ))}
    </ul>
  );
}
