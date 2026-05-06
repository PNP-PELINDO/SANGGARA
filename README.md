<div align="center">
  <img src="/sanggara/login.png" alt="SANGGARA Login Portal" width="100%">
  
  <br />

  # SANGGARA (Sistem Anggaran & Realisasi Terintegrasi)

  <p align="center">
    <strong>Enterprise Financial & Budget Monitoring System</strong><br>
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

## System Overview

**SANGGARA** adalah dashboard finansial internal tingkat korporasi untuk memantau, mengelola, dan mengotomatisasi pengawasan Pagu Anggaran (Budget Ceiling) secara real-time. Sistem ini secara presisi melacak Commitment (nilai kontrak) dan Actual (realisasi pengeluaran) pada setiap Chart of Accounts (COA). 

Dibangun dengan arsitektur Master-Detail View dan antarmuka Glassmorphism, aplikasi ini dirancang untuk navigasi yang efisien serta dilengkapi fitur Dark/Light Mode dinamis.

---

## Completed Features

Berikut adalah daftar fitur inti yang telah diselesaikan dan diimplementasikan ke dalam sistem:

- [x] **Visualisasi & Analitik:** Grafik interaktif (Chart.js) untuk evaluasi metrik anggaran dan persentase penyerapan.
- [x] **Real-time Monitoring:** Indikator otomatis berbasis kalkulasi saldo untuk memantau status anggaran (Terkendali / Overbudget).
- [x] **Manajemen Master & Transaksi:** Sentralisasi data Pagu Anggaran per COA dan pencatatan pengeluaran otomatis (Running Balance).
- [x] **Export Reporting:** Kapabilitas ekstraksi data laporan ke format Excel/CSV.
- [x] **AI Financial Analyst:** Integrasi AI interaktif untuk analisis data historis dan strategi finansial.
- [x] **RBAC & Audit Trail:** Manajemen otorisasi pengguna (Administrator / JM SDM) dilengkapi rekam jejak aktivitas operasional (Create, Update, Delete).

---

## System Interface

### Dashboard & Analytics
<p align="center">
  <img src="/sanggara/dashboard.png" width="49%" alt="Main Dashboard 1">
  <img src="/sanggara/analisis.png" width="49%" alt="Analytics Chart">
</p>

### Budget Management & Transactions
<p align="center">
  <img src="/sanggara/mainanggaran.png" width="49%" alt="Master Budget">
  <img src="/sanggara/coa.png" width="49%" alt="Transaction List">
</p>

### Administration & Logs
<p align="center">
  <img src="/sanggara/user.png" width="49%" alt="User Management">
  <img src="/sanggara/log.png" width="49%" alt="Audit Log">
</p>

---

## Technology Stack

- Frontend: React.js, Tailwind CSS, Chart.js
- Backend: Laravel, PHP 8.x
- Routing & Bridge: Inertia.js
- Database: MySQL
- Build Tool: Vite

---

## Local Environment Setup

Panduan teknis untuk instalasi SANGGARA pada environment lokal.

1. Kloning Repositori & Masuk ke Direktori
```bash
git clone [https://github.com/USERNAME_GITHUB_KAMU/sanggara.git](https://github.com/USERNAME_GITHUB_KAMU/sanggara.git)
cd sanggara
