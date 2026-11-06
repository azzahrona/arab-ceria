import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { to: '/belajar', emoji: '📚', title: 'Belajar Kosakata', text: 'Kenali 48 kosakata Arab dari 6 tema seru.', color: 'mint' },
  { to: '/kuis', emoji: '⭐', title: 'Kuis Ceria', text: 'Uji ingatanmu lewat 10 soal pilihan ganda.', color: 'yellow' },
  { to: '/permainan', emoji: '🎮', title: 'Permainan', text: 'Belajar sambil bermain dan mencocokkan kata.', color: 'pink' },
  { to: '/progres', emoji: '🏆', title: 'Progres Belajar', text: 'Lihat bintang dan perkembangan belajarmu.', color: 'blue' }
];

export default function HomePage() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  return (
    <div className="home-page page-container">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">🌟 HALO, TEMAN CERDAS!</span>
          <h1>{user ? `Ahlan wa sahlan, ${user.name.split(' ')[0]}!` : 'Yuk, belajar bahasa Arab dengan ceria!'}</h1>
          <p>Kenali kata-kata bahasa Arab dari benda dan hal yang dekat dengan keseharianmu. Belajar, dengarkan, bermain, lalu kumpulkan bintang!</p>
          <div className="hero-actions">
            {user ? (
              <Link className="button button-primary button-large" to={isTeacher ? '/guru' : '/belajar'}>{isTeacher ? 'Buka Dashboard Guru' : 'Mulai Belajar'} <span>→</span></Link>
            ) : (
              <><Link className="button button-primary button-large" to="/daftar">Mulai Belajar <span>→</span></Link><Link className="button button-outline button-large" to="/masuk">Saya sudah punya akun</Link></>
            )}
          </div>
          <div className="hero-note"><span>🧡</span> Mudah • Menyenangkan • Untuk kelas 3–4 SD</div>
        </div>
        <div className="hero-art" aria-label="Ilustrasi belajar bahasa Arab">
          <div className="sun-shape">☀️</div>
          <div className="hero-book">📖</div>
          <div className="hero-arabic" lang="ar" dir="rtl">مَرْحَبًا</div>
          <div className="hero-student">🧒🏻</div>
          <span className="float-star star-one">⭐</span><span className="float-star star-two">✨</span><span className="float-star star-three">🌼</span>
          <div className="art-caption">Ayo belajar bersama!</div>
        </div>
      </section>

      <section className="welcome-strip">
        <div className="welcome-icon">💡</div>
        <div><strong>Belajar sedikit demi sedikit, yuk!</strong><p>Setiap kata baru adalah satu langkah hebat. Kamu pasti bisa!</p></div>
        <span className="welcome-sparkle">✦</span>
      </section>

      <section className="section-block">
        <div className="section-heading"><div><span className="eyebrow">PILIH KEGIATANMU</span><h2>Mau belajar apa hari ini?</h2></div><span className="heading-doodle">🌈</span></div>
        <div className="feature-grid">
          {features.map((feature) => (
            <Link className={`feature-card feature-${feature.color}`} to={user ? feature.to : '/masuk'} key={feature.to}>
              <span className="feature-emoji">{feature.emoji}</span><span className="feature-arrow">↗</span>
              <h3>{feature.title}</h3><p>{feature.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="how-section">
        <div><span className="eyebrow">TIGA LANGKAH MUDAH</span><h2>Belajar jadi lebih asyik!</h2></div>
        <div className="steps-row">
          <div className="step-item"><span>1</span><div>📖</div><strong>Pelajari kata</strong><small>Lihat dan dengarkan kosakata.</small></div>
          <div className="step-connector">··········</div>
          <div className="step-item"><span>2</span><div>🧩</div><strong>Main dan berlatih</strong><small>Jawab kuis dan permainan.</small></div>
          <div className="step-connector">··········</div>
          <div className="step-item"><span>3</span><div>🏅</div><strong>Lihat kemajuan</strong><small>Rayakan setiap pencapaian.</small></div>
        </div>
      </section>

      <section className="teacher-callout">
        <div><span className="eyebrow">UNTUK PENDAMPING BELAJAR</span><h2>Halo, Bapak dan Ibu Guru! 👩‍🏫</h2><p>Pantau perkembangan belajar siswa melalui dashboard guru.</p></div>
        <Link to="/masuk?role=guru" className="button button-dark">Masuk sebagai Guru →</Link>
      </section>
    </div>
  );
}
