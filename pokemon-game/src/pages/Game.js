import React, { useEffect, useMemo, useState } from 'react';
import { fetchAllNames, fetchPokemon, getBestImage } from '../api/Poke';
import Silhouette from '../components/Silhouette';
import GuessBox from '../components/GuessBox';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Game() {
  // dati di gioco
  const [names, setNames] = useState([]);
  const [answer, setAnswer] = useState(null);      // oggetto pokemon
  const [img, setImg] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [status, setStatus] = useState('idle');    // idle | correct | wrong
  const [loading, setLoading] = useState(true);
  const [hintUsed, setHintUsed] = useState(false);


  // punteggio e errori
  const [score, setScore] = useState(0);
  const [errorsLeft, setErrorsLeft] = useState(5);
  const [wrongGuesses, setWrongGuesses] = useState([]); // lista di {guess, correctName}

  const gameOver = errorsLeft <= 0;

  // carico una volta la lista nomi e avvio il primo round
  useEffect(() => {
    (async () => {
      const all = await fetchAllNames();
      setNames(all);
      await newRound(all);
    })();
  }, []);

async function newRound(allNames = names) {
  setLoading(true);
  setRevealed(false);
  setStatus('idle');
  setHintUsed(false);

  const targetName = pickRandom(allNames);
  const p = await fetchPokemon(targetName);
  const best = getBestImage(p);

  setAnswer(p);
  setImg(best);
  setLoading(false);
}

  function onGuess(guess) {
    if (!answer || gameOver) return;
    const correct = answer.name.toLowerCase();

    if (guess === correct) {
      setStatus('correct');
      setRevealed(true);
      setScore(s => s + 10);
    } else {
      setStatus('wrong');
      setErrorsLeft(n => n - 1);
      setWrongGuesses(list => [...list, { guess, correctName: correct }]);
    }
  }

  async function onNext() {
    if (gameOver) return;
    await newRound();
  }

  async function onReveal() {
    setRevealed(true);
  }

  function onShare() {
    const lines = [];
    lines.push(`Indovina il Pokémon — punteggio: ${score}`);
    lines.push(`Errori: ${wrongGuesses.length}/5`);
    if (wrongGuesses.length) {
      lines.push('Tentativi sbagliati:');
      wrongGuesses.forEach((w, i) => {
        lines.push(`${i+1}. "${w.guess}" (corretto: ${w.correctName})`);
      });
    }
    const text = lines.join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
    alert('Risultato copiato negli appunti!');
  }

  function onRestart() {
    setScore(0);
    setErrorsLeft(5);
    setWrongGuesses([]);
    setRevealed(false);
    setStatus('idle');
    setHintUsed(false);
    newRound();
  }

  const canGuess = !loading && !gameOver;
  const message = useMemo(() => {
    if (loading) return 'Carico…';
    if (gameOver) return 'Game Over 😵';
    if (status === 'correct') return `✅ Era ${answer.name}! +10 punti`;
    if (status === 'wrong') return '❌ Ritenta!';
    return 'Indovina il Pokémon…';
  }, [loading, status, gameOver, answer]);

  return (
    <div>
      <div style={{display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:12}}>
        <div>🔢 Punti: <b>{score}</b></div>
        <div>❤️ Errori rimasti: <b>{errorsLeft}</b></div>
        <button
          onClick={() => setHintUsed(true)}
          disabled={loading || hintUsed}
          style={btnStyle}
        >
          Suggerimento
        </button>
      </div>

      {gameOver ? (
        <Summary
          score={score}
          wrongGuesses={wrongGuesses}
          onShare={onShare}
          onRestart={onRestart}
        />
      ) : (
        <>
          <Silhouette src={img} revealed={revealed} />
          <p style={{textAlign:'center', minHeight:24}}>{message}</p>
          {hintUsed && answer && !gameOver && (
            <div style={{textAlign:'center', marginTop:4, fontWeight:'bold'}}>
              Inizia con: {answer.name.charAt(0).toUpperCase()}
            </div>
          )}

          <GuessBox names={names} onGuess={onGuess} disabled={!canGuess} />

          <div style={{display:'flex', gap:8, justifyContent:'center', marginTop:12}}>
            <button onClick={onNext} disabled={loading} style={btnStyle}>Prossimo Pokémon</button>
            <button onClick={onShare} disabled={loading} style={btnStyle}>Condividi</button>
          </div>
        </>
      )}
    </div>
  );
}

function Summary({ score, wrongGuesses, onShare, onRestart }) {
  return (
    <div style={{border:'1px solid #eee', borderRadius:12, padding:16}}>
      <h2 style={{textAlign:'center'}}>Riepilogo</h2>
      <p style={{textAlign:'center'}}>Punteggio: <b>{score}</b></p>
      {wrongGuesses.length ? (
        <>
          <h3>Errori</h3>
          <ol>
            {wrongGuesses.map((w,i) => (
              <li key={i}>
                Hai scritto <b>{w.guess}</b> — corretto: <b>{w.correctName}</b>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p>Nessun errore! 🎉</p>
      )}
      <div style={{display:'flex', gap:8, justifyContent:'center', marginTop:12}}>
        <button onClick={onShare} style={btnStyle}>Condividi risultato</button>
        <button onClick={onRestart} style={btnStyle}>Ricomincia</button>
      </div>
    </div>
  );
}

const btnStyle = {
  padding:'8px 12px',
  borderRadius:8,
  border:'1px solid #ddd',
  background:'#fafafa',
  cursor:'pointer'
};
