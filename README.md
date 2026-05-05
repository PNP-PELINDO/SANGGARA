<div align="center">
  <img src="/sanggara/login.png" alt="SANGGARA Login Portal" width="100%">
  
  <br />

  # ⚓ SANGGARA (Sistem Anggaran & Realisasi Terintegrasi)

  <p align="center">
    <strong>Enterprise Financial & Budget Monitoring Portal</strong><br>
    <em>Developed for PT Pelabuhan Indonesia (Pelindo) Regional 2 Teluk Bayur</em>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=inertia&logoColor=white" alt="Inertia" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  </p>
</div>

---

## 📖 Tentang Projek

**SANGGARA** adalah aplikasi *dashboard* finansial internal yang dirancang khusus untuk memonitor, mengelola, dan mengotomatisasi pengawasan Pagu Anggaran (Budget Ceiling) secara *real-time*. Sistem ini menggantikan pencatatan manual menjadi digitalisasi terpusat, memungkinkan manajemen untuk melacak *Commitment* (kontrak) dan *Actual* (realisasi pengeluaran) pada setiap Item Anggaran (Chart of Accounts / COA) dengan presisi tinggi.

Aplikasi ini menggunakan pola **Master-Detail View** untuk mempercepat navigasi pengguna dan mengadopsi antarmuka **Glassmorphism** modern yang dilengkapi dengan fitur *Dark/Light Mode*.

## ✨ Fitur Utama

- **📊 Visualisasi Data & Analisis:** Grafik interaktif (Chart.js) untuk memantau kesehatan anggaran dan persentase penyerapan dana.
- **🎯 Monitoring Realisasi Terintegrasi:** Indikator otomatis (Aman / Overbudget) berdasarkan kalkulasi sisa dana.
- **💵 Manajemen Master Anggaran:** Sentralisasi data Pagu Anggaran per COA.
- **📝 Input Transaksi Dinamis:** Pencatatan pengeluaran harian (*Running Balance*) dengan penghitungan saldo instan dan fitur Export ke Excel/CSV.
- **🤖 AI Financial Analyst:** Integrasi *Artificial Intelligence* (Chatbox) untuk membantu analisis data secara prediktif.
- **👥 Role & User Management:** Kontrol akses khusus untuk Administrator / JM SDM.
- **📜 Log Aktivitas (Audit Trail):** Rekam jejak aktivitas (*Create, Update, Delete*) untuk keamanan data.

---

## 📸 Tampilan Sistem (Screenshots)

### 🎛️ Dashboard Utama
<p align="center">
  <img src="/sanggara/dashboard.png" width="49%">
  <img src="/sanggara/dashboard2.png" width="49%">
</p>

### 📈 Analisis & Monitoring
<p align="center">
  <img src="/sanggara/analisis.png" width="49%" alt="Analisis Grafik">
  <img src="/sanggara/monitoring.png" width="49%" alt="Monitoring Realisasi">
</p>

### 📋 Manajemen Anggaran & Transaksi (COA)
<p align="center">
  <img src="/sanggara/mainanggaran.png" width="49%" alt="Master Anggaran">
  <img src="/sanggara/coa.png" width="49%" alt="Transaksi">
</p>

### ⚙️ Manajemen Pengguna & Sistem
<p align="center">
  <img src="/sanggara/user.png" width="49%" alt="Kelola User">
  <img src="/sanggara/log.png" width="49%" alt="Log Aktivitas">
</p>

---

## 🛠️ Stack Teknologi

Sistem ini dibangun dengan arsitektur *Monolith berbasis Inertia*, memberikan pengalaman *Single Page Application* (SPA) tanpa perlu membangun API terpisah.

- **Frontend:** React.js, Tailwind CSS, Chart.js
- **Backend:** Laravel, PHP 8.x
- **Bridge/Routing:** Inertia.js
- **Database:** MySQL
- **Build Tool:** Vite v8

---

## 🚀 Panduan Instalasi (Lokal)

Ikuti langkah-langkah berikut untuk menjalankan SANGGARA di mesin lokal (Development Environment).

**1. Clone Repositori**
```bash
git clone [https://github.com/USERNAME_GITHUB_KAMU/sanggara.git](https://github.com/USERNAME_GITHUB_KAMU/sanggara.git)
cd sanggara
