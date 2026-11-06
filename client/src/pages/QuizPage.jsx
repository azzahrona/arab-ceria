import { useState } from 'react';
import { api } from '../lib/api';

export default function QuizPage() {
  const [quizId, setQuizId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const startQuiz = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await api('/quiz/start', { method: 'POST' });
      setQuizId(data.quizId);
      setQuestions(data.questions);
      setIndex(0);
      setSelected(null);
      setFeedback(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const finishQuiz = async (activeQuizId) => {
    setSubmitting(true);
    try {
      const data = await api('/quiz/submit', { method: 'POST', body: { quizId: activeQuizId } });
      setResult(data);
      setQuizId('');
    } catch (err) {
      setError(err.message);
      setQuizId('');
      setQuestions([]);
    } finally {
      setSubmitting(false);
    }
  };

  const chooseAnswer = async (optionId) => {
    if (selected || submitting || !questions[index]) return;
    const current = questions[index];
    setSelected(optionId);
    setError('');
    try {
      const answer = await api('/quiz/answer', {
        method: 'POST',
        body: { quizId, questionId: current.id, optionId }
      });
      setFeedback(answer);
      await new Promise((resolve) => window.setTimeout(resolve, 950));
      if (index === questions.length - 1) {
        await finishQuiz(quizId);
      } else {
        setIndex((value) => value + 1);
        setSelected(null);
        setFeedback(null);
      }
    } catch (err) {
      setError(err.message);
      setSelected(null);
      setFeedback(null);
      setQuizId('');
      setQuestions([]);
    }
  };

  const current = questions[index];
  const score = result?.result?.score ?? 0;

  return (
    <div className="page-container content-page">
      <section className="page-title-row">
        <div><span className="eyebrow">⭐ SAATNYA TANTANGAN!</span><h1>Kuis Ceria</h1><p>Jawab 10 soal pilihan ganda. Pilih jawaban yang menurutmu paling tepat.</p></div>
        <div className="page-title-emoji">🧠</div>
      </section>
      {error && <div className="notice-error" role="alert">⚠️ {error}</div>}

      {!questions.length && !result && !submitting && (
        <section className="quiz-start-card">
          <div className="quiz-big-emoji">🎯</div>
          <h2>Siap mengumpulkan bintang?</h2>
          <p>Soal diacak dari 48 kosakata. Jawaban diperiksa dan nilaimu akan tersimpan di progres belajar.</p>
          <div className="quiz-facts"><span>🔟 10 soal</span><span>🔀 Soal diacak</span><span>🏅 Nilai tersimpan</span></div>
          <button className="button button-primary button-large" onClick={startQuiz} disabled={loading}>
            {loading ? 'Menyiapkan soal...' : 'Mulai Kuis →'}
          </button>
        </section>
      )}

      {current && !result && (
        <section className="quiz-card">
          <div className="quiz-topline"><span className="quiz-tag">PILIH JAWABAN</span><span className="quiz-number">Soal {index + 1} dari 10</span></div>
          <div className="quiz-progress"><div style={{ width: `${((index + 1) / 10) * 100}%` }} /></div>
          <div className="quiz-question">
            <span>{current.direction === 'arabic-to-meaning' ? 'Apa arti dari kata bahasa Arab ini?' : 'Apa bahasa Arab dari kata berikut?'}</span>
            {current.direction === 'arabic-to-meaning'
              ? <strong className="arabic-word quiz-arabic" lang="ar" dir="rtl">{current.prompt}</strong>
              : <strong className="quiz-indonesian">{current.promptEmoji} {current.prompt}</strong>}
          </div>
          <div className="quiz-options">
            {current.options.map((option, optionIndex) => {
              const isChosen = selected === option.id;
              const isCorrect = feedback && option.id === feedback.correctOptionId;
              const isWrongChoice = feedback && isChosen && !feedback.isCorrect;
              return (
                <button
                  key={option.id}
                  className={`quiz-option ${isChosen ? 'chosen' : ''} ${isCorrect ? 'correct' : ''} ${isWrongChoice ? 'incorrect' : ''}`}
                  onClick={() => chooseAnswer(option.id)}
                  disabled={Boolean(selected) || submitting}
                >
                  <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                  {current.direction === 'arabic-to-meaning'
                    ? <span>{option.emoji} {option.label}</span>
                    : <span className="arabic-option" lang="ar" dir="rtl">{option.label}</span>}
                </button>
              );
            })}
          </div>
          {feedback && (
            <div className={`quiz-feedback ${feedback.isCorrect ? 'good' : 'try-again'}`} role="status">
              {feedback.isCorrect ? 'Benar! Hebat sekali! 🎉' : (
                <>Belum tepat. Jawaban yang benar: {current.direction === 'meaning-to-arabic'
                  ? <strong lang="ar" dir="rtl" className="arabic-option">{feedback.correctAnswer}</strong>
                  : <strong>{feedback.correctEmoji || ''} {feedback.correctAnswer}</strong>}. Tetap semangat! 💪</>
              )}
            </div>
          )}
        </section>
      )}

      {submitting && <div className="empty-state">💾 Menyimpan hasil kuismu...</div>}

      {result && (
        <section className="quiz-result-card">
          <div className="result-confetti">{score >= 8 ? '🏆' : score >= 5 ? '🌟' : '🌱'}</div>
          <span className="eyebrow">HASIL KUISMU</span>
          <h2>{score >= 8 ? 'Luar biasa!' : score >= 5 ? 'Bagus sekali!' : 'Tetap semangat!'}</h2>
          <div className="score-circle"><strong>{result.result.percentage}</strong><span>/ 100</span></div>
          <p>{result.message}</p>
          <div className="result-detail"><span>Jawaban benar <b>{score} soal</b></span><span>Perlu latihan lagi <b>{10 - score} soal</b></span></div>
          <button className="button button-primary button-large" onClick={() => { setResult(null); setQuestions([]); setIndex(0); setFeedback(null); }}>Coba Kuis Lagi ↻</button>
        </section>
      )}
    </div>
  );
}
