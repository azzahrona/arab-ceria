export function speakArabic(text) {
  if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
    window.alert('Fitur suara belum didukung browser ini. Coba gunakan Chrome atau Edge terbaru.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.78;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export default function WordCard({ word, categoryName, learned, onToggleLearned, busy = false }) {
  return (
    <article className={`word-card ${learned ? 'word-card-learned' : ''}`}>
      <div className="word-card-top"><span className="word-emoji">{word.emoji}</span><span className="word-category">{categoryName}</span></div>
      <div className="arabic-word" lang="ar" dir="rtl">{word.arabic}</div>
      <div className="word-transliteration">{word.transliteration}</div>
      <div className="word-meaning">{word.meaning}</div>
      <div className="word-card-actions">
        <button className="button button-sound" onClick={() => speakArabic(word.arabic)} aria-label={`Dengarkan ${word.meaning}`}>🔊 Dengarkan</button>
        <button className={`button ${learned ? 'button-learned' : 'button-outline'}`} onClick={() => onToggleLearned(word.id, !learned)} disabled={busy}>
          {learned ? '✓ Sudah dipelajari' : '＋ Tandai dipelajari'}
        </button>
      </div>
    </article>
  );
}
