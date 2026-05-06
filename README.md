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

**SANGGARA** adalah platform *dashboard* finansial internal tingkat korporasi yang dirancang untuk memantau, mengelola, dan mengotomatisasi pengawasan Pagu Anggaran (*Budget Ceiling*) secara komprehensif dan *real-time*. Sistem ini mentransformasi proses pencatatan konvensional menjadi infrastruktur digital terpusat, memungkinkan pihak manajemen untuk melacak *Commitment* (nilai kontrak) dan *Actual* (realisasi pengeluaran) pada setiap *Chart of Accounts* (COA) dengan presisi tingkat tinggi.

Aplikasi ini diimplementasikan menggunakan arsitektur **Master-Detail View** guna mengoptimalkan efisiensi navigasi pengguna, dipadukan dengan antarmuka **Glassmorphism** berstandar modern serta fungsionalitas *Dark/Light Mode* dinamis untuk kenyamanan operasional.

## Core Features

- **Visualisasi Data & Analitika:** Implementasi grafik interaktif (Chart.js) untuk evaluasi kesehatan metrik anggaran dan persentase penyerapan secara akurat.
- **Monitoring Realisasi Terintegrasi:** Sistem indikator otomatis berbasis kalkulasi saldo untuk membedakan status kelayakan anggaran (Terkendali / *Overbudget*).
- **Manajemen Master Anggaran:** Sentralisasi dan pemeliharaan basis data Pagu Anggaran secara terstruktur per COA.
- **Input Transaksi Dinamis:** Sistem pencatatan pengeluaran (*Running Balance*) terotomatisasi dengan perhitungan saldo instan, dilengkapi kapabilitas ekstraksi pelaporan (Export to Excel/CSV).
- **AI Financial Analyst:** Integrasi *Artificial Intelligence* guna memfasilitasi analisis data historis dan penyusunan strategi finansial secara interaktif.
- **Role-Based Access Control (RBAC):** Manajemen otorisasi dan hierarki pengguna secara spesifik (Administrator / JM SDM).
- **Sistem Audit Trail:** Perekaman rekam jejak aktivitas operasional (*Create, Update, Delete*) secara terperinci guna memastikan integritas dan akuntabilitas data.

---

## System Interface

### Main Dashboard
<p align="center">
  <img src="/sanggara/dashboard.png" width="49%" alt="Main Dashboard 1">
  <img src="/sanggara/dashboard2.png" width="49%" alt="Main Dashboard 2">
</p>

### Analytics & Monitoring
<p align="center">
  <img src="/sanggara/analisis.png" width="49%" alt="Analytics Chart">
  <img src="/sanggara/monitoring.png" width="49%" alt="Real-time Monitoring">
</p>

### Budget & Transaction Management (COA)
<p align="center">
  <img src="/sanggara/mainanggaran.png" width="49%" alt="Master Budget">
  <img src="/sanggara/coa.png" width="49%" alt="Transaction List">
</p>

### User & System Administration
<p align="center">
  <img src="/sanggara/user.png" width="49%" alt="User Management">
  <img src="/sanggara/log.png" width="49%" alt="Audit Log">
</p>

---

## Technology Stack

Sistem ini dikembangkan menggunakan arsitektur *Monolith* berbasis Inertia, memberikan performa optimal setara *Single Page Application* (SPA) dengan keamanan *backend* yang solid.

- **Frontend:** React.js, Tailwind CSS, Chart.js
- **Backend:** Laravel, PHP 8.x
- **Routing & Data Bridge:** Inertia.js
- **Database:** MySQL
- **Build System:** Vite v8

---

## Local Environment Setup

Panduan teknis untuk melakukan instalasi SANGGARA pada mesin pengembangan lokal (*Development Environment*).

**1. Kloning Repositori**
```bash
git clone [https://github.com/USERNAME_GITHUB_KAMU/sanggara.git](https://github.com/USERNAME_GITHUB_KAMU/sanggara.git)
cd sanggara
