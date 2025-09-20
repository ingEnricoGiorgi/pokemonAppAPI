import React from 'react';

export default function Silhouette({ src, revealed }) {
  const style = {
    width: 256,
    height: 256,
    objectFit: 'contain',
    imageRendering: 'pixelated',
    filter: revealed ? 'none' : 'brightness(0) contrast(1.6)',
    transition: 'filter 0.2s ease',
    display: 'block',
    margin: '1rem auto',
    background: '#f4f4f4',
    borderRadius: 12
  };
  if (!src) return <div style={{...style}} aria-label="loading image" />;
  return <img src={src} alt="Who's that Pokémon?" style={style} />;
}
