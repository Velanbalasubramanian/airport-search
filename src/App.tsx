import { useState } from 'react';
import { AirportAutocomplete } from './airport-autocomplete';
import type { Airport } from './types';

export function App() {
  const [selected, setSelected] = useState<Airport | null>(null);

  return (
    <main>
      <h1>Airport Search</h1>
      <AirportAutocomplete onSelect={setSelected} />
      {selected && <pre>{JSON.stringify(selected, null, 2)}</pre>}
    </main>
  );
}
