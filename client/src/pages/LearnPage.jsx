import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import WordCard from '../components/WordCard';
import ProgressBar from '../components/ProgressBar';

export default function LearnPage() {
  const [categories, setCategories] = useState([]);
  const [words, setWords] = useState([]);
  const [learned, setLearned] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [wordData, progressData] = await Promise.all([api('/words'), api('/progress/me')]);
      setCategories(wordData.categories);
      setWords(wordData.words);
      setLearned(progressData.progress.learnedWords);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const visibleWords = useMemo(() => words.filter((word) => {
    const matchesCategory = activeCategory === 'all' || word.categoryId === activeCategory;
    const query = search.trim().toLocaleLowerCase('id');
    const matchesSearch = !query || [word.meaning, word.transliteration, word.arabic].some((value) => value.toLocaleLowerCase('id').includes(query));
    return matchesCategory && matchesSearch;
  }), [words, activeCategory, search]);

  const toggleLearned = async (wordId, nextLearned) => {
    if (saving) return;
    setError('');
    const previous = learned;
    setSaving(true);
    setLearned(nextLearned ? [...learned, wordId] : learned.filter((id) => id !== wordId));
    try {
      const result = await api('/progress/learned', { method: 'POST', body: { wordId, learned: nextLearned } });
      setLearned(result.progress.learnedWords);
    } catch (err) {
      setLearned(previous);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const percentage = words.length ? Math.round((learned.length / words.length) * 100) : 0;

  return (
    <div className="page-container content-page">
      <section className="page-title-row"><div><span className="eyebrow">📚 KAMUS MINI KITA</span><h1>Belajar Kosakata</h1><p>Ada 48 kata seru yang siap kamu kenali. Tekan tombol suara untuk mendengarkan!</p></div><div className="page-title-emoji">🦋</div></section>
      <section className="learning-summary"><div><strong>{learned.length} dari {words.length || 48} kata dipelajari</strong><span>Terus semangat, ya!</span></div><div className="summary-progress"><ProgressBar value={percentage} label="Progres kosakata" /></div></section>
      {error && <div className="notice-error">⚠️ {error}</div>}
      <div className="learn-toolbar"><div className="search-box"><span>🔎</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kata, arti, atau tulisan Arab..." /></div><div className="result-count">{visibleWords.length} kosakata</div></div>
      <div className="category-filter">
        <button className={activeCategory === 'all' ? 'active' : ''} onClick={() => setActiveCategory('all')}>🌈 Semua tema</button>
        {categories.map((category) => <button key={category.id} className={activeCategory === category.id ? 'active' : ''} onClick={() => setActiveCategory(category.id)}>{category.emoji} {category.name} <span className="category-arabic" lang="ar" dir="rtl">{category.arabic}</span></button>)}
      </div>
      {loading ? <div className="empty-state">🌼 Memuat kosakata...</div> : visibleWords.length ? (
        <div className="word-grid">{visibleWords.map((word) => {
          const category = categories.find((item) => item.id === word.categoryId);
          return <WordCard key={word.id} word={word} categoryName={category?.name || ''} learned={learned.includes(word.id)} onToggleLearned={toggleLearned} busy={saving} />;
        })}</div>
      ) : <div className="empty-state"><span>🧐</span><strong>Kata belum ditemukan</strong><p>Coba kata lain atau pilih tema yang berbeda.</p></div>}
    </div>
  );
}
