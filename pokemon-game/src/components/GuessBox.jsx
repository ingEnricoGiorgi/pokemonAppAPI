import React, { useEffect, useMemo, useRef, useState } from 'react';

function norm(s) {
  return (s || '').toString().trim().toLowerCase();
}

export default function GuessBox({ names, onGuess, disabled }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  const suggestions = useMemo(() => {
    const nQ = norm(q);
    if (!nQ) return [];
    const starts = names.filter(n => n.startsWith(nQ));
    const contains = names.filter(n => !n.startsWith(nQ) && n.includes(nQ));
    return [...starts, ...contains].slice(0, 10);
  }, [q, names]);

  useEffect(() => {
    function onDocClick(e) {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function submitGuess(value) {
    const guess = norm(value ?? q);
    if (!guess || disabled) return;
    onGuess(guess);
    // non svuoto per poter ritentare; se vuoi svuotare: setQ('');
    setOpen(false);
  }

  return (
    <div ref={boxRef} style={{position:'relative'}}>
      <form onSubmit={e => { e.preventDefault(); submitGuess(); }}>
        <input
          disabled={disabled}
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Scrivi il nome del Pokémon…"
          style={{width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid #ddd'}}
        />
      </form>

      {open && suggestions.length > 0 && !disabled && (
        <ul style={{
          position:'absolute', left:0, right:0, marginTop:6,
          maxHeight:220, overflow:'auto', background:'white',
          border:'1px solid #ddd', borderRadius:8, boxShadow:'0 8px 20px rgba(0,0,0,0.08)', zIndex:10
        }}>
          {suggestions.map(name => (
            <li key={name}
              onMouseDown={e => { e.preventDefault(); submitGuess(name); }}
              style={{padding:'8px 12px', cursor:'pointer'}}
            >
              {name}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => submitGuess()}
        disabled={disabled}
        style={{marginTop:10, padding:'8px 12px', borderRadius:8, border:'1px solid #ddd', background:'#fafafa'}}
      >
        Indovina
      </button>
    </div>
  );
}
