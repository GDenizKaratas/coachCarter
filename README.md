# Coach Carter - Angular 20 Time Tracker

Modern bir Angular 20 uygulaması ile kişisel coaching zaman takibi.

## Özellikler

### ⏱️ Timer Sistemi

- Start/stop/pause fonksiyonları
- Kategori ve hedef seçimi
- Real-time sayaç (HH:MM:SS)
- Otomatik kayıt (stop durumunda)

### 📊 Dashboard

- Bugünün özeti (toplam süre, kategori dağılımı)
- Aktif timer göstergesi
- Hızlı başlat butonları

### 📁 Kategori Yönetimi

- CRUD operations (Create, Read, Update, Delete)
- Renk kodlu kategoriler
- Kategori bazlı zaman takibi

### 📈 Analitik

- Haftalık bar chart
- Kategori dağılımı
- Performans metrikleri

## Teknik Özellikler

- **Angular 20** (zoneless mode)
- **Standalone components** (default)
- **Signals** for state management
- **LocalStorage** ile veri saklama
- **Responsive, mobile-first** design
- **Inline templates** ve styles

## Proje Yapısı

```
src/app/
├── core/
│   ├── models/          # TypeScript interfaces
│   ├── services/        # Signal-based services
│   └── utils/           # Helper functions
├── shared/              # Reusable components & pipes
└── pages/               # Page components
    ├── dashboard.ts
    ├── timer.ts
    ├── categories/
    └── analytics/
```

## Kurulum

```bash
npm install
npm start
```

## Kullanım

1. **Kategoriler**: Önce kategorilerinizi oluşturun
2. **Timer**: Kategori seçerek zaman takibine başlayın
3. **Dashboard**: Günlük özetinizi görün
4. **Analitik**: Haftalık performansınızı analiz edin

## Veri Modelleri

- **Category**: id, name, color, icon?, createdAt
- **Goal**: id, categoryId, name, description?, targetMinutes, createdAt
- **TimeEntry**: id, date, startTime?, endTime?, durationMinutes, categoryId, goalId?, notes?, tags?

## Geliştirme

Uygulama tamamen signal-based reactive patterns kullanır ve production-ready kod standartlarında yazılmıştır.
