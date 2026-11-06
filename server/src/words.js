export const categories = [
  { id: 'colors', name: 'Warna', arabic: 'الألوان', emoji: '🎨', description: 'Kenali warna di sekitarmu.' },
  { id: 'animals', name: 'Hewan', arabic: 'الحيوانات', emoji: '🐾', description: 'Belajar nama hewan yang lucu.' },
  { id: 'fruits', name: 'Buah-buahan', arabic: 'الفواكه', emoji: '🍉', description: 'Yuk, kenali nama buah.' },
  { id: 'school', name: 'Benda Sekolah', arabic: 'أدوات المدرسة', emoji: '🎒', description: 'Kosakata benda di sekolah.' },
  { id: 'body', name: 'Anggota Tubuh', arabic: 'أعضاء الجسم', emoji: '🧒', description: 'Kenali bagian tubuh.' },
  { id: 'family', name: 'Keluarga', arabic: 'الأسرة', emoji: '🏡', description: 'Belajar nama anggota keluarga.' }
];

export const words = [
  // Warna
  { id: 'color-red', categoryId: 'colors', arabic: 'أَحْمَرُ', transliteration: 'aḥmaru', meaning: 'Merah', emoji: '🔴' },
  { id: 'color-blue', categoryId: 'colors', arabic: 'أَزْرَقُ', transliteration: 'azraqu', meaning: 'Biru', emoji: '🔵' },
  { id: 'color-yellow', categoryId: 'colors', arabic: 'أَصْفَرُ', transliteration: 'aṣfaru', meaning: 'Kuning', emoji: '🟡' },
  { id: 'color-green', categoryId: 'colors', arabic: 'أَخْضَرُ', transliteration: 'akhḍaru', meaning: 'Hijau', emoji: '🟢' },
  { id: 'color-black', categoryId: 'colors', arabic: 'أَسْوَدُ', transliteration: 'aswadu', meaning: 'Hitam', emoji: '⚫' },
  { id: 'color-white', categoryId: 'colors', arabic: 'أَبْيَضُ', transliteration: 'abyaḍu', meaning: 'Putih', emoji: '⚪' },
  { id: 'color-purple', categoryId: 'colors', arabic: 'بَنَفْسَجِيٌّ', transliteration: 'banafsajiyyun', meaning: 'Ungu', emoji: '🟣' },
  { id: 'color-orange', categoryId: 'colors', arabic: 'بُرْتُقَالِيٌّ', transliteration: 'burtuqāliyyun', meaning: 'Jingga', emoji: '🟠' },
  // Hewan
  { id: 'animal-cat', categoryId: 'animals', arabic: 'قِطَّةٌ', transliteration: 'qiṭṭatun', meaning: 'Kucing', emoji: '🐱' },
  { id: 'animal-dog', categoryId: 'animals', arabic: 'كَلْبٌ', transliteration: 'kalbun', meaning: 'Anjing', emoji: '🐶' },
  { id: 'animal-bird', categoryId: 'animals', arabic: 'عُصْفُورٌ', transliteration: 'ʿuṣfūrun', meaning: 'Burung', emoji: '🐦' },
  { id: 'animal-fish', categoryId: 'animals', arabic: 'سَمَكَةٌ', transliteration: 'samakah', meaning: 'Ikan', emoji: '🐟' },
  { id: 'animal-rabbit', categoryId: 'animals', arabic: 'أَرْنَبٌ', transliteration: 'arnabun', meaning: 'Kelinci', emoji: '🐰' },
  { id: 'animal-cow', categoryId: 'animals', arabic: 'بَقَرَةٌ', transliteration: 'baqaratun', meaning: 'Sapi', emoji: '🐮' },
  { id: 'animal-horse', categoryId: 'animals', arabic: 'حِصَانٌ', transliteration: 'ḥiṣānun', meaning: 'Kuda', emoji: '🐴' },
  { id: 'animal-elephant', categoryId: 'animals', arabic: 'فِيلٌ', transliteration: 'fīlun', meaning: 'Gajah', emoji: '🐘' },
  // Buah-buahan
  { id: 'fruit-apple', categoryId: 'fruits', arabic: 'تُفَّاحَةٌ', transliteration: 'tuffāḥatun', meaning: 'Apel', emoji: '🍎' },
  { id: 'fruit-banana', categoryId: 'fruits', arabic: 'مَوْزٌ', transliteration: 'mawzun', meaning: 'Pisang', emoji: '🍌' },
  { id: 'fruit-orange', categoryId: 'fruits', arabic: 'بُرْتُقَالَةٌ', transliteration: 'burtuqālatun', meaning: 'Jeruk', emoji: '🍊' },
  { id: 'fruit-grape', categoryId: 'fruits', arabic: 'عِنَبٌ', transliteration: 'ʿinabun', meaning: 'Anggur', emoji: '🍇' },
  { id: 'fruit-mango', categoryId: 'fruits', arabic: 'مَانْجَا', transliteration: 'mānjā', meaning: 'Mangga', emoji: '🥭' },
  { id: 'fruit-watermelon', categoryId: 'fruits', arabic: 'بِطِّيخٌ', transliteration: 'biṭṭīkhun', meaning: 'Semangka', emoji: '🍉' },
  { id: 'fruit-strawberry', categoryId: 'fruits', arabic: 'فَرَاوِلَةٌ', transliteration: 'farāwilah', meaning: 'Stroberi', emoji: '🍓' },
  { id: 'fruit-pineapple', categoryId: 'fruits', arabic: 'أَنَانَاسٌ', transliteration: 'anānāsun', meaning: 'Nanas', emoji: '🍍' },
  // Benda sekolah
  { id: 'school-book', categoryId: 'school', arabic: 'كِتَابٌ', transliteration: 'kitābun', meaning: 'Buku', emoji: '📘' },
  { id: 'school-pencil', categoryId: 'school', arabic: 'قَلَمُ رَصَاصٍ', transliteration: 'qalamu raṣāṣin', meaning: 'Pensil', emoji: '✏️' },
  { id: 'school-pen', categoryId: 'school', arabic: 'قَلَمٌ', transliteration: 'qalamun', meaning: 'Pulpen', emoji: '🖊️' },
  { id: 'school-bag', categoryId: 'school', arabic: 'حَقِيبَةٌ', transliteration: 'ḥaqībatun', meaning: 'Tas', emoji: '🎒' },
  { id: 'school-ruler', categoryId: 'school', arabic: 'مِسْطَرَةٌ', transliteration: 'misṭaratun', meaning: 'Penggaris', emoji: '📏' },
  { id: 'school-eraser', categoryId: 'school', arabic: 'مِمْحَاةٌ', transliteration: 'mimḥātun', meaning: 'Penghapus', emoji: '🧽' },
  { id: 'school-desk', categoryId: 'school', arabic: 'مَكْتَبٌ', transliteration: 'maktabun', meaning: 'Meja', emoji: '🪑' },
  { id: 'school-notebook', categoryId: 'school', arabic: 'دَفْتَرٌ', transliteration: 'daftarun', meaning: 'Buku tulis', emoji: '📓' },
  // Anggota tubuh
  { id: 'body-head', categoryId: 'body', arabic: 'رَأْسٌ', transliteration: 'raʾsun', meaning: 'Kepala', emoji: '🙂' },
  { id: 'body-eye', categoryId: 'body', arabic: 'عَيْنٌ', transliteration: 'ʿaynun', meaning: 'Mata', emoji: '👁️' },
  { id: 'body-ear', categoryId: 'body', arabic: 'أُذُنٌ', transliteration: 'udhunun', meaning: 'Telinga', emoji: '👂' },
  { id: 'body-nose', categoryId: 'body', arabic: 'أَنْفٌ', transliteration: 'anfun', meaning: 'Hidung', emoji: '👃' },
  { id: 'body-mouth', categoryId: 'body', arabic: 'فَمٌ', transliteration: 'famun', meaning: 'Mulut', emoji: '👄' },
  { id: 'body-hand', categoryId: 'body', arabic: 'يَدٌ', transliteration: 'yadun', meaning: 'Tangan', emoji: '✋' },
  { id: 'body-foot', categoryId: 'body', arabic: 'قَدَمٌ', transliteration: 'qadamun', meaning: 'Kaki', emoji: '🦶' },
  { id: 'body-hair', categoryId: 'body', arabic: 'شَعْرٌ', transliteration: 'shaʿrun', meaning: 'Rambut', emoji: '💇' },
  // Keluarga
  { id: 'family-father', categoryId: 'family', arabic: 'أَبٌ', transliteration: 'abun', meaning: 'Ayah', emoji: '👨' },
  { id: 'family-mother', categoryId: 'family', arabic: 'أُمٌّ', transliteration: 'ummun', meaning: 'Ibu', emoji: '👩' },
  { id: 'family-brother', categoryId: 'family', arabic: 'أَخٌ', transliteration: 'akhun', meaning: 'Saudara laki-laki', emoji: '👦' },
  { id: 'family-sister', categoryId: 'family', arabic: 'أُخْتٌ', transliteration: 'ukhtun', meaning: 'Saudara perempuan', emoji: '👧' },
  { id: 'family-grandfather', categoryId: 'family', arabic: 'جَدٌّ', transliteration: 'jaddun', meaning: 'Kakek', emoji: '👴' },
  { id: 'family-grandmother', categoryId: 'family', arabic: 'جَدَّةٌ', transliteration: 'jaddatun', meaning: 'Nenek', emoji: '👵' },
  { id: 'family-son', categoryId: 'family', arabic: 'اِبْنٌ', transliteration: 'ibnun', meaning: 'Anak laki-laki', emoji: '🧒' },
  { id: 'family-daughter', categoryId: 'family', arabic: 'بِنْتٌ', transliteration: 'bintun', meaning: 'Anak perempuan', emoji: '👧' }
];
