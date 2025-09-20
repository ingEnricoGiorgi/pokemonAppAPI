const API = 'https://pokeapi.co/api/v2';

export async function fetchAllNames() {
  const r = await fetch(`${API}/pokemon?limit=100000&offset=0`);
  const data = await r.json();
  // restituisco SOLO i nomi in minuscolo
  return data.results.map(x => x.name.toLowerCase());
}

export async function fetchPokemon(idOrName) {
  const r = await fetch(`${API}/pokemon/${idOrName}`);
  if (!r.ok) throw new Error('Pokemon not found');
  return r.json();
}

export function getBestImage(p) {
  return (
    p?.sprites?.other?.['official-artwork']?.front_default ||
    p?.sprites?.other?.dream_world?.front_default ||
    p?.sprites?.other?.home?.front_default ||
    p?.sprites?.front_default ||
    null
  );
}
