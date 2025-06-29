
# Laporan Proyek Mesin Penerjemah Bahasa Sunda - Indonesia (BASA TRANSLATOR)

## 1. Tentang Projek

Proyek mesin penerjemah dua arah antara Bahasa Sunda dan Bahasa Indonesia ini dibuat untuk memenuhi Ujian Akhir Semester (UAS) mata kuliah Pemrosesan Bahasa Alami yang diampu oleh Bapak Zainal Abidin. Aplikasi yang dihasilkan bernama **BASA TRANSLATOR**, sebuah platform web sederhana yang memungkinkan pengguna untuk menerjemahkan teks dari Bahasa Indonesia ke Bahasa Sunda dan sebaliknya dengan mudah dan cepat.

Tujuan utama proyek ini adalah untuk menerapkan konsep-konsep yang telah dipelajari dalam mata kuliah, terutama dalam memanfaatkan model bahasa (Large Language Models) untuk tugas terjemahan.

## 2. Proses Pengerjaan

Pengerjaan proyek ini dibagi menjadi beberapa tahapan utama, mulai dari penyiapan lingkungan pengembangan hingga implementasi fitur dan pengujian.

### a. Penyiapan Lingkungan Pengembangan
Proyek ini dikembangkan menggunakan **Firebase Studio**, sebuah lingkungan pengembangan berbasis web yang terintegrasi dengan ekosistem Firebase dan Google. Firebase Studio menyediakan boilerplate aplikasi Next.js, lengkap dengan library UI (ShadCN) dan setup untuk fungsi AI menggunakan **Genkit**. Hal ini mempercepat proses inisiasi proyek secara signifikan.

### b. Perancangan Antarmuka Pengguna (UI)
Antarmuka pengguna dirancang agar sederhana dan intuitif. Komponen utama pada halaman adalah:
- **Dua buah area teks (Textarea)**: Satu untuk input (teks sumber) dan satu lagi untuk output (teks hasil terjemahan).
- **Dua buah menu dropdown (Select)**: Untuk memilih bahasa sumber dan menampilkan bahasa target.
- **Tombol "Translate"**: Untuk memicu proses penerjemahan.
- **Tombol "Swap"**: Ikon panah bolak-balik untuk menukar bahasa sumber dan target dengan cepat.

Seluruh komponen UI dibangun menggunakan `shadcn/ui` yang sudah tersedia dalam proyek.

### c. Implementasi Logika Penerjemahan (Backend)
Logika penerjemahan tidak dibuat dari nol, melainkan memanfaatkan kemampuan dari model AI generatif yang disediakan oleh Google melalui **Genkit**.

1.  **Membuat Flow Genkit**: Kami mendefinisikan sebuah *flow* di `src/ai/flows/translate-indonesian-sundanese.ts`. Flow ini berfungsi sebagai "agen" yang akan menerima permintaan terjemahan.
2.  **Mendefinisikan Input dan Output**: Kami menggunakan Zod untuk mendefinisikan skema input (teks dan bahasa sumber) dan skema output (teks terjemahan dan bahasa target). Ini memastikan data yang diproses oleh AI sesuai format yang diharapkan.
3.  **Membuat Prompt**: Kami merancang sebuah *prompt* (perintah) yang sangat spesifik untuk model AI. Prompt ini menginstruksikan model untuk bertindak sebagai ahli penerjemah Sunda-Indonesia dan menerjemahkan teks yang diberikan.
    ```
    You are a machine translation expert specializing in translating between Indonesian and Sundanese.

    Translate the following text from {{sourceLanguage}} to {{#ifEquals sourceLanguage "indonesian"}}sundanese{{else}}indonesian{{/ifEquals}}.

    Text: {{{text}}}
    ```
4.  **Menghubungkan ke Frontend**: Flow Genkit yang telah dibuat kemudian diimpor dan dipanggil dari komponen React di `src/app/page.tsx` ketika pengguna menekan tombol "Translate".

### d. Integrasi Frontend dan Backend
Komponen frontend (`page.tsx`) dihubungkan dengan flow Genkit.
- **State Management**: React `useState` digunakan untuk mengelola data input, data output, status *loading* saat proses penerjemahan, dan bahasa yang dipilih.
- **Form Handling**: `react-hook-form` dimanfaatkan untuk validasi input, memastikan pengguna tidak mengirimkan teks kosong.
- **Asynchronous Call**: Fungsi penerjemahan dipanggil secara asinkron (`async/await`) untuk mencegah UI menjadi *freeze* saat menunggu respons dari model AI.

## 3. Tools Yang Digunakan

-   **Firebase Studio**: Sebagai lingkungan pengembangan utama (IDE) dan runtime. Keunggulannya adalah integrasi yang mulus dengan Genkit dan kemudahan dalam setup awal.
-   **Next.js & React**: Sebagai kerangka kerja untuk membangun antarmuka pengguna (frontend) yang modern dan interaktif.
-   **Genkit**: Toolkit dari Google untuk membangun aplikasi berbasis AI. Dalam proyek ini, Genkit digunakan untuk memanggil model `gemini-2.0-flash` yang melakukan tugas penerjemahan.
-   **ShadCN/UI & Tailwind CSS**: Untuk membangun komponen UI yang responsif dan estetis dengan cepat.
-   **Git & GitHub**: Digunakan untuk manajemen versi kode dan kolaborasi antar anggota tim.

## 4. Hasil Pengujian

Pengujian dilakukan secara manual untuk memverifikasi fungsionalitas utama aplikasi.

### Skenario Pengujian 1: Indonesia ke Sunda
-   **Input Teks**: "Saya sedang makan nasi dengan lauk ayam goreng."
-   **Bahasa Sumber**: Indonesian
-   **Hasil yang Diharapkan**: Terjemahan yang akurat dalam Bahasa Sunda.
-   **Hasil Aktual**: "Abdi nuju tuang sangu sareng deungeunna hayam goreng."
-   **Kesimpulan**: **Berhasil**. Terjemahan yang dihasilkan akurat dan sesuai dengan konteks.

### Skenario Pengujian 2: Sunda ke Indonesia
-   **Input Teks**: "Kamari abdi ameng ka Bandung sareng rerencangan."
-   **Bahasa Sumber**: Sundanese
-   **Hasil yang Diharapkan**: Terjemahan yang akurat dalam Bahasa Indonesia.
-   **Hasil Aktual**: "Kemarin saya bermain ke Bandung bersama teman-teman."
-   **Kesimpulan**: **Berhasil**. Model mampu menerjemahkan dari Bahasa Sunda ke Bahasa Indonesia dengan benar.

### Skenario Pengujian 3: Fitur Tukar Bahasa (Swap)
-   **Aksi**: Setelah melakukan terjemahan dari Indonesia ke Sunda, pengguna menekan tombol "Swap".
-   **Hasil yang Diharapkan**: Teks pada kolom output (hasil terjemahan Sunda) pindah ke kolom input, teks pada kolom input (Indonesia) pindah ke kolom output, dan pilihan bahasa sumber berubah menjadi "Sundanese".
-   **Hasil Aktual**: Fitur berjalan sesuai harapan.
-   **Kesimpulan**: **Berhasil**.

### Skenario Pengujian 4: Input Kosong
-   **Aksi**: Pengguna menekan tombol "Translate" tanpa memasukkan teks.
-   **Hasil yang Diharapkan**: Muncul pesan error yang meminta pengguna memasukkan teks.
-   **Hasil Aktual**: "Please enter text to translate." muncul di bawah area input.
-   **Kesimpulan**: **Berhasil**. Validasi input berfungsi dengan baik.

## 5. Penutup

Proyek BASA TRANSLATOR berhasil diselesaikan dan memenuhi semua fungsionalitas yang direncanakan. Dengan memanfaatkan Firebase Studio dan Genkit, proses pengembangan aplikasi berbasis AI menjadi lebih efisien. Model bahasa modern terbukti mampu melakukan tugas penerjemahan untuk bahasa daerah seperti Bahasa Sunda dengan tingkat akurasi yang tinggi. Proyek ini memberikan pengalaman praktis yang berharga dalam mengimplementasikan solusi Pemrosesan Bahasa Alami di dunia nyata.
