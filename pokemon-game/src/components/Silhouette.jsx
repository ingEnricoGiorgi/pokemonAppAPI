// src/components/PokemonImage.jsx
import React from 'react';

export default function PokemonImage({ src }) {
  const style = {
    width: 256,
    height: 256,
    objectFit: 'contain',
    imageRendering: 'pixelated',
    display: 'block',
    margin: '1rem auto',
    background: '#f4f4f4',
    borderRadius: 12
  };
  if (!src) return <div style={style} aria-label="no image" />; // box vuoto se manca
  return <img src={src} alt="Pokémon" style={style} />;
}
