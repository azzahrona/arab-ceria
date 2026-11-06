import { useEffect, useState } from 'react';
import { api } from '../lib/api';

function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }

function GuessMeaningGame({ words }) {
  const [rounds, setRounds] = useState([]);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);

  const start = () => {
    const picks = shuffle(words).slice(0, 5).map((word) => ({ word, options: shuffle([word, ...shuffle(words.filter((item) => item.id !== word.id)).slice(0, 3)]) }));
    setRounds(picks); setRound(0); setScore(0); setSelected(null); setDone(false);
  };

  const choose = (id) => {
    if (selected) return;
    const correct = id === rounds[round].word.id;
    setSelected(id);
    if (correct) setScore((value) => value + 1);
    window.setTimeout(() => {
      if (round === 4) setDone(true);
      else { setRound((value) => value + 1); setSelected(null); }
    }, 850);
  };

  if (!rounds.length) return <div className="game-intro"><div className="game-big-icon">🕵️</div><h2>Tebak Arti</h2><p>Lihat kata bahasa Arab, lalu pilih arti bahasa Indonesianya yang benar.</p><button className="button button-primary" onClick={start} disabled={words.length < 5}>Mulai bermain →</button></div>;
  if (done) return <div className="game-finish"><span>🎉</span><h2>Permainan selesai!</h2><p>Kamu menjawab benar <strong>{score} dari 5</strong> soal.</p><button className="button button-primary" onClick={start}>Main lagi ↻</button></div>;

  const current = rounds[round];
  return <div className="mini-game"><div className="game-round">Babak {round + 1} / 5</div><div className="game-arabic" lang="ar" dir="rtl">{current.word.arabic}</div><p className="game-hint">Apa arti kata di atas?</p><div className="game-choice-grid">{current.options.map((option) => <button key={option.id} className={`game-choice ${selected === option.id ? (option.id === current.word.id ? 'correct' : 'incorrect') : ''}`} onClick={() => choose(option.id)} disabled={Boolean(selected)}>{option.emoji} {option.meaning}</button>)}</div>{selected && <p className="game-feedback">{selected === current.word.id ? 'Tepat sekali! 🌟' : `Jawabannya: ${current.word.meaning}. Tetap semangat!`}</p>}</div>;
}

function PairGame({ words }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);

  const start = () => {
    const picks = shuffle(words).slice(0, 4);
    const deck = picks.flatMap((word) => [
      { id: `${word.id}-word`, pairId: word.id, type: 'word', content: word.arabic },
      { id: `${word.id}-emoji`, pairId: word.id, type: 'emoji', content: word.emoji }
    ]);
    setCards(shuffle(deck)); setFlipped([]); setMatched([]); setMoves(0); setStarted(true);
  };

  const flip = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.pairId)) return;
    const next = [...flipped, card.id];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((value) => value + 1);
      const first = cards.find((item) => item.id === next[0]);
      if (first.pairId === card.pairId && first.type !== card.type) {
        setMatched((value) => [...value, card.pairId]);
        window.setTimeout(() => setFlipped([]), 450);
      } else {
        window.setTimeout(() => setFlipped([]), 850);
      }
    }
  };

  const complete = started && matched.length === 4;
  if (!started) return <div className="game-intro"><div className="game-big-icon">🧩</div><h2>Pasangkan Kata</h2><p>Buka kartu dan cocokkan tulisan Arab dengan emoji yang sesuai. Ada 4 pasangan!</p><button className="button button-primary" onClick={start} disabled={words.length < 4}>Mulai bermain →</button></div>;
  return <div className="pair-game-area"><div className="pair-game-meta"><span>Langkah: <b>{moves}</b></span><span>Pasangan: <b>{matched.length}/4</b></span><button className="text-link" onClick={start}>Ulangi permainan ↻</button></div><div className="pair-grid">{cards.map((card) => {
    const isOpen = flipped.includes(card.id) || matched.includes(card.pairId);
    return <button key={card.id} className={`pair-card ${isOpen ? 'pair-card-open' : ''} ${matched.includes(card.pairId) ? 'pair-card-matched' : ''}`} onClick={() => flip(card)} disabled={matched.includes(card.pairId)}>{isOpen ? card.type === 'word' ? <span className="arabic-pair" lang="ar" dir="rtl">{card.content}</span> : <span className="emoji-pair">{card.content}</span> : <span className="pair-question">?</span>}</button>;
  })}</div>{complete && <div className="pair-complete">🎊 Hebat! Semua pasangan ditemukan dalam {moves} langkah. <button className="text-link" onClick={start}>Main lagi</button></div>}</div>;
}

export default function GamesPage() {
  const [words, setWords] = useState([]);
  const [mode, setMode] = useState('guess');
  const [error, setError] = useState('');
  useEffect(() => { api('/words').then((data) => setWords(data.words)).catch((err) => setError(err.message)); }, []);

  return (
    <div className="page-container content-page">
      <section className="page-title-row"><div><span className="eyebrow">🎮 WAKTUNYA BERMAIN</span><h1>Permainan Edukatif</h1><p>Belajar bahasa Arab sambil bermain. Pilih permainan favoritmu!</p></div><div className="page-title-emoji">🧸</div></section>
      <div className="game-tabs"><button className={mode === 'guess' ? 'active' : ''} onClick={() => setMode('guess')}>🕵️ Tebak Arti</button><button className={mode === 'pair' ? 'active' : ''} onClick={() => setMode('pair')}>🧩 Pasangkan Kata</button></div>
      {error && <div className="notice-error">{error}</div>}
      <section className="game-stage">{!words.length ? <div className="empty-state">🌼 Menyiapkan permainan...</div> : mode === 'guess' ? <GuessMeaningGame words={words} /> : <PairGame words={words} />}</section>
      <div className="game-encouragement">💛 Tidak apa-apa jika salah. Setiap mencoba berarti kamu sedang belajar!</div>
    </div>
  );
}
