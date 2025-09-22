const API = 'https://pokeapi.co/api/v2';
//All generation
/*
export async function fetchAllNames() {
  const r = await fetch(`${API}/pokemon?limit=100000&offset=0`);
  const data = await r.json();
  return data.results.map(x => x.name.toLowerCase());
}
  */
//GENRAZIONE 1
export async function fetchAllNames() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151'); // solo i primi 151
  const data = await res.json();
  return data.results.map(p => p.name);
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
