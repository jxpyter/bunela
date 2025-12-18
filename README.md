# Bunela - Kelime Öğrenme Platformu

## Ekran Görüntüleri

### Anasayfa
<img width="1920" height="1080" alt="Homepage" src="https://github.com/user-attachments/assets/ce91d7ff-0535-40c8-98c7-3bd050eabe79" />
<img width="1920" height="1080" alt="Homepage2" src="https://github.com/user-attachments/assets/d24f3713-f323-477d-b5f9-b6aabe09232f" />

### Words
<img width="1920" height="1080" alt="Words" src="https://github.com/user-attachments/assets/330eaa22-6c14-4844-b649-e140dd1c904c" />

### Panel
<img width="1920" height="1080" alt="Panel" src="https://github.com/user-attachments/assets/051e67f9-906f-40fd-a809-dfc5876bf5d7" />
<img width="1920" height="1080" alt="AddWord" src="https://github.com/user-attachments/assets/41556f93-c44e-4f23-a866-7d99c3603702" />


Aralıklı tekrar (SM-2 algoritması) kullanarak İngilizce kelime öğrenmek için modern bir web uygulaması.

## 🚀 Özellikler

- **Akıllı Öğrenme**: Optimum hatırlama için SM-2 aralıklı tekrar algoritması
- **Çoklu Seviye Desteği**: A1'den C2'ye kadar kategorize edilmiş kelimeler (CEFR seviyeleri)
- **Güzel Arayüz**: Glassmorphism ve akıcı animasyonlarla modern tasarım
- **İlerleme Takibi**: Seri sayacı, istatistikler ve öğrenme ilerlemesi
- **Yönetici Paneli**: Kelime yönetimi, toplu içe/dışa aktarım için CMS
- **Kullanıcı Kimlik Doğrulama**: JWT tabanlı güvenli kimlik doğrulama

## 🛠️ Teknoloji Yığını

### Backend

- Node.js + Express + TypeScript
- MongoDB (Mongoose)
- JWT Kimlik Doğrulama
- Hız Sınırlama (Rate Limiting) & Sıkıştırma

### Frontend

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- React Query (TanStack Query)
- Framer Motion
- Axios

## 📦 Kurulum

### Ön Gereksinimler

- Node.js (v18 veya üzeri)
- MongoDB (yerel veya bulut örneği)

### Backend Kurulumu

```bash
cd backend
npm install
```

Backend dizininde `.env` dosyası oluşturun:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=senin_mongodb_baglanti_adresin
JWT_SECRET=gizli-anahtarin
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@bunela.com
ADMIN_PASSWORD=admin123
```

### Veritabanı Tohumlama (Seeding)

> **Not:** Tohum (seed) ve kontrol scriptleri bu projeden kaldırılmıştır. Veritabanına kelime eklemek için kendi scriptinizi oluşturmalı veya Admin Panelini kullanmalısınız.

Sunucuyu başlatın:

```bash
npm run dev
```

### Frontend Kurulumu

```bash
cd frontend
npm install
```

Frontend dizininde `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

## 🎯 Kullanım

1. **Kayıt Ol/Giriş Yap**: Bir hesap oluşturun veya giriş yapın
2. **Panel**: Öğrenme istatistiklerinizi ve ilerlemenizi görüntüleyin
3. **Öğren**: Zamanı gelen kelimeleri gözden geçirin ve yeni kelimeler öğrenin
4. **Yönetici Paneli**: Kelimeleri yönetin (sadece yönetici) - `admin@bunela.com` / `admin123` ile giriş yapın

## 📊 SM-2 Algoritması

Uygulama, öğrenmeyi optimize etmek için SM-2 aralıklı tekrar algoritmasını kullanır:

- Kalite puanları: 0-5 (0 = tamamen unutulmuş, 5 = mükemmel hatırlama)
- Gözden geçirmelerin otomatik zamanlanması
- Performansınıza göre uyarlanabilir zorluk

## 🗂️ Proje Yapısı

```
bunela/
├── backend/
│   ├── src/
│   │   ├── config/       # Veritabanı bağlantısı
│   │   ├── models/       # Mongoose şemaları (User, Word, UserProgress)
│   │   ├── routes/       # API rotaları (auth, words, progress)
│   │   ├── controllers/  # Rota işleyicileri
│   │   ├── middleware/   # Auth, doğrulama
│   │   ├── services/     # SM-2 algoritma uygulaması
│   │   └── scripts/      # Veritabanı tohumlama
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── app/              # Next.js app router sayfaları
│   │   ├── admin/        # Yönetici paneli
│   │   ├── dashboard/    # Kullanıcı paneli
│   │   ├── learn/        # Öğrenme arayüzü
│   │   ├── login/        # Kimlik doğrulama
│   │   └── register/     # Kullanıcı kaydı
│   ├── components/       # React bileşenleri
│   │   ├── ui/           # Yeniden kullanılabilir UI bileşenleri (shadcn/ui)
│   │   └── ...           # Özel bileşenler
│   ├── context/          # React context sağlayıcıları
│   ├── lib/              # API istemcisi, yardımcı araçlar
│   ├── types/            # TypeScript tip tanımları
│   ├── public/           # Statik varlıklar
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── package.json          # Kök bağımlılıklar
└── README.md
```

## 🔒 Güvenlik Özellikleri

- JWT token kimlik doğrulama
- bcrypt ile şifre hashleme
- API uç noktalarında hız sınırlama
- CORS koruması
- Helmet güvenlik başlıkları

## 📝 API Uç Noktaları

### Kimlik Doğrulama

- `POST /api/auth/register` - Yeni kullanıcı oluştur
- `POST /api/auth/login` - Giriş yap
- `GET /api/auth/me` - Mevcut kullanıcıyı getir
- `PUT /api/auth/settings` - Ayarları güncelle

### Kelimeler

- `GET /api/words` - Tüm kelimeleri getir
- `GET /api/words/:id` - Tek bir kelimeyi getir
- `POST /api/words` - Kelime oluştur (yönetici)
- `PUT /api/words/:id` - Kelime güncelle (yönetici)
- `DELETE /api/words/:id` - Kelime sil (yönetici)
- `POST /api/words/bulk-import` - Toplu içe aktar (yönetici)

### İlerleme

- `GET /api/progress/due` - Zamanı gelen kelimeleri getir
- `GET /api/progress/new` - Yeni kelimeleri getir
- `POST /api/progress/review` - İnceleme gönder
- `GET /api/progress/stats` - İstatistikleri getir

## 🎨 Tasarım Özellikleri

- Gradyan arka planlar
- Glassmorphism efektleri
- 3D çevirme kartı animasyonları
- Akıcı geçişler
- Duyarlı tasarım
- Karanlık tema desteği

## 📄 Lisans

MIT

## 👥 Yazar

jxpyter
