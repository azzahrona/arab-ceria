# Arab Ceria – Belajar Bahasa Arab Jadi Menyenangkan

Website pembelajaran bahasa Arab untuk siswa SD kelas 3–4. Proyek ini menggunakan React + Vite untuk frontend, Express.js untuk backend, dan file JSON lokal sebagai penyimpanan data.

## Fitur

- Registrasi, login, dan logout siswa.
- Login guru demo (`guru` / `guru123`).
- 48 kosakata dalam 6 tema: warna, hewan, buah-buahan, benda sekolah, anggota tubuh, dan keluarga.
- Pencarian, filter tema, transliterasi, arti, emoji, dan pelafalan melalui Web Speech API (`ar-SA`) jika didukung browser.
- Penandaan kosakata yang sudah dipelajari dan penyimpanan progres per akun.
- Kuis 10 soal acak. Soal diacak dan jawaban diperiksa oleh backend; nilai akhir disimpan.
- Dua permainan: Tebak Arti dan Pasangkan Kata.
- Halaman progres siswa dan dashboard pemantauan guru.
- Password siswa dan guru disimpan sebagai hash bcrypt, bukan teks biasa.
- Penulisan `db.json` dilakukan melalui antrean dan file sementara yang dipindahkan secara atomik.
- Tampilan responsif untuk laptop dan ponsel.

## Persyaratan

- Node.js 18 atau lebih baru (disarankan Node.js 20+).
- npm.
- Browser modern. Chrome atau Edge terbaru disarankan untuk fitur suara.

Tidak diperlukan MySQL, PostgreSQL, MongoDB, Firebase, atau layanan database eksternal.

## Instalasi

Buka terminal di folder proyek `arab-ceria`, lalu jalankan:

```bash
npm run setup
```

Perintah tersebut memasang alat pengembang di folder utama, kemudian dependensi backend dan frontend.

### Konfigurasi backend (opsional tetapi disarankan)

Salin `server/.env.example` menjadi `server/.env`, lalu ubah `JWT_SECRET` menjadi string acak yang panjang. Contoh:

```env
PORT=4000
JWT_SECRET=isi-dengan-secret-acak-yang-panjang
```

Jika `.env` tidak dibuat, server tetap dapat berjalan untuk demo lokal dengan secret acak sementara. Dalam kondisi tersebut, pengguna perlu login kembali setiap kali backend dimulai ulang. Data akun, progres, dan nilai kuis tetap tersimpan.

## Menjalankan website

Jalankan frontend dan backend bersamaan dari folder utama:

```bash
npm run dev
```

Buka alamat berikut di browser:

- Website: http://localhost:5173
- API backend: http://localhost:4000/api/health

Untuk mencoba tampilan melalui ponsel yang terhubung ke Wi-Fi yang sama, buka `http://IP-LAPTOP:5173` (ganti `IP-LAPTOP` dengan alamat IP lokal laptop). Izinkan akses melalui firewall jika diminta.

Untuk menghentikan server, tekan `Ctrl + C` pada terminal.

### Menjalankan secara terpisah

Jika ingin menggunakan dua terminal:

Terminal 1 – backend:

```bash
npm run dev --prefix server
```

Terminal 2 – frontend:

```bash
npm run dev --prefix client
```

## Akun demo guru

- Username: `guru`
- Password: `guru123`

Akun guru dibuat otomatis saat backend pertama kali dijalankan. Password disimpan dalam bentuk hash bcrypt di `server/data/db.json`.

## Penyimpanan data

Semua data disimpan pada:

```text
server/data/db.json
```

File tersebut dibuat dan diisi akun guru demo secara otomatis saat backend pertama kali dijalankan. Data siswa, hash password, kosakata yang sudah dipelajari, dan riwayat nilai kuis tersimpan di file tersebut. Data tetap ada setelah server dimatikan dan dijalankan kembali.

Untuk membuat cadangan, salin `server/data/db.json` ketika server sedang tidak melakukan aktivitas penulisan. Jangan menghapus atau mengedit file tersebut saat server sedang berjalan.

## Build frontend

Untuk memeriksa dan membuat build produksi frontend:

```bash
npm run build
```

Hasil build tersedia di `client/dist`. Backend tetap dijalankan terpisah dengan `npm start` dari folder utama. Untuk demo pengembangan, gunakan `npm run dev`.

## API utama

| Metode | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/health` | Pemeriksaan backend |
| POST | `/api/auth/register` | Registrasi siswa |
| POST | `/api/auth/login` | Login siswa/guru |
| GET | `/api/auth/me` | Memeriksa sesi login |
| POST | `/api/auth/logout` | Logout (token dihapus di sisi aplikasi) |
| GET | `/api/words` | Mengambil 48 kosakata dan tema |
| GET | `/api/progress/me` | Mengambil progres akun siswa yang sedang login |
| POST | `/api/progress/learned` | Menambah/menghapus status kosakata dipelajari |
| POST | `/api/quiz/start` | Membuat 10 soal acak untuk sesi kuis |
| POST | `/api/quiz/answer` | Memeriksa satu jawaban pada sesi kuis |
| POST | `/api/quiz/submit` | Menyimpan hasil setelah 10 soal selesai |
| GET | `/api/teacher/students` | Data dan progres semua siswa (khusus guru) |

Endpoint progres siswa hanya dapat diakses oleh pemilik akun yang sedang login. Dashboard seluruh siswa hanya dapat diakses dengan akun berperan guru.

## Catatan keamanan dan penggunaan

Proyek ini dirancang untuk dijalankan secara lokal sebagai proyek pembelajaran. Jangan mengekspos server langsung ke internet atau menggunakannya untuk data pribadi sungguhan tanpa peninjauan keamanan lebih lanjut, HTTPS, secret yang kuat, pembatasan percobaan login, dan pengelolaan akun yang sesuai. Token login disimpan di `localStorage` browser. Sesi kuis aktif disimpan sementara di memori backend; jika backend dimulai ulang di tengah kuis, siswa cukup memulai kuis baru. Nilai kuis yang sudah selesai tetap tersimpan di `db.json`.

## Struktur folder

```text
arab-ceria/
├── client/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── context/
│       ├── lib/
│       ├── pages/
│       ├── main.jsx
│       └── styles.css
├── server/
│   ├── data/
│   │   └── db.json
│   ├── src/
│   │   ├── db.js
│   │   ├── index.js
│   │   └── words.js
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json
└── README.md
```
