import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Instagram, MessageCircle, Mail, Send,
  Camera, X, ShoppingBag, ChevronRight, Info, Menu
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Papa from 'papaparse'; // Import parser CSV

const App = () => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [remoteDatabase, setRemoteDatabase] = useState({});

  // Ganti dengan URL "Publish to Web" CSV Anda
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRaP3mcWr151iaKzjRqTIZ5FQVrN_FPodepGlbhbMoC6lgqPF4HTHTnvN_61DgaJPhL4hNyThUaCcXg/pub?output=csv";
  const MATERI_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQGDAHwR-aWO-SMnBncunt0cdHc04kwEavzovxcNb_C9Q1ng8MMQ0zWtIzrJZBkqqpHAshBlOd_FLAo/pub?output=csv";

  // Logika Scanner
  useEffect(() => {
    let scanner = null;
    if (isScanning) {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 20,
        qrbox: { width: 250, height: 250 }
      });

      scanner.render((text) => {
        let id = "";

        // Logika Filter: Cek apakah teks hasil scan adalah URL
        try {
          const url = new URL(text);
          // Jika URL, ambil parameter 'id'
          id = url.searchParams.get("id");
        } catch (e) {
          // Jika bukan URL (teks biasa), gunakan teks tersebut sebagai ID
          // Menangani format URL manual atau path (misal: /lombok-abang)
          id = text.split('id=').pop().split('&')[0] || text.split('/').pop();
        }

        // Cari di database Sheets yang sudah didownload
        const result = remoteDatabase[id] || {
          q: "Data tidak ditemukan",
          a: "ID '" + id + "' belum terdaftar. Pastikan barcode sesuai dengan balok Tata Krama."
        };

        setScanResult(result);
        setIsScanning(false);
        scanner.clear();
      }, (err) => {
        // Diamkan error NotFoundException agar tidak spam konsol
      });
    }
    return () => scanner?.clear();
  }, [isScanning, remoteDatabase]);



  useEffect(() => {
    // Fungsi untuk load data
    const loadData = (url) => {
      return new Promise((resolve) => {
        Papa.parse(url, {
          download: true,
          header: true,
          complete: (results) => resolve(results.data),
        });
      });
    };

    Promise.all([loadData(SHEET_URL), loadData(MATERI_URL)]).then(([jawaban, materi]) => {
      const combinedData = {};

      // Proses data jawaban
      jawaban.forEach(row => {
        if (row.id) combinedData[row.id] = { q: row.q, a: row.a, type: 'Jawaban' };
      });

      // Proses data materi
      materi.forEach(row => {
        if (row.id) combinedData[row.id] = { q: row.title, a: row.data, type: row.type };
      });

      setRemoteDatabase(combinedData);
    });
  }, []);

  useEffect(() => {
    if (Object.keys(remoteDatabase).length > 0) {
      // 1. Ambil parameter 'id' dari URL (misal: ?id=lombok-abang)
      const params = new URLSearchParams(window.location.search);
      const idFromUrl = params.get('id');

      // 2. Jika ada ID di URL, cari jawabannya
      if (idFromUrl && remoteDatabase[idFromUrl]) {
        setScanResult(remoteDatabase[idFromUrl]);

        // 3. Scroll otomatis ke bagian scanner agar jawaban terlihat
        const scannerSection = document.getElementById('scanner');
        if (scannerSection) {
          scannerSection.scrollIntoView({ behavior: 'smooth' });
        }

        // 4. (Opsional) Bersihkan URL agar saat di-refresh tidak terus memunculkan jawaban
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [remoteDatabase]); // Berjalan setelah data Google Sheets berhasil dimuat

  const navLinks = [
    { name: "Tentang", href: "#home" },
    { name: "Keunggulan", href: "#keunggulan" },
    { name: "Seri Utama", href: "#produk" },
    { name: "Scanner", href: "#scanner" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 batik-overlay z-0 pointer-events-none"></div>

      {/* Navigation */}
      <nav className="fixed w-full z-100 bg-[#1a0f06]/95 border-b border-[#c5a059]/20 backdrop-blur-md px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-serif-royal font-bold text-[#c5a059] tracking-widest">TATA KRAMA</h2>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-10 text-[10px] tracking-[0.3em] uppercase font-bold text-[#f5e6ca]/70">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="hover:text-[#c5a059] transition">{link.name}</a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-[#c5a059]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#1a0f06] border-t border-[#c5a059]/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6 text-center tracking-[0.2em] uppercase text-xs font-bold">
                {navLinks.map(link => (
                  <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-[#f5e6ca]">{link.name}</a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-16 px-6 z-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-6 text-center lg:text-left order-2 lg:order-1"
          >
            <span className="text-[#c5a059] font-bold tracking-[0.4em] text-[10px] md:text-xs uppercase">Edukasi Budaya Yogyakarta</span>
            <h1 className="text-5xl md:text-8xl font-serif-royal text-[#f5e6ca] leading-tight md:leading-none">
              Main, Belajar, <br />
              <span className="text-[#c5a059]">Berbudaya.</span>
            </h1>
            <p className="text-[#f5e6ca]/80 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Tata Krama menghadirkan pengalaman belajar sejarah Keraton melalui permainan balok kayu atraktif.
            </p>
            <div className="flex justify-center lg:justify-start">
              <button className="w-full md:w-auto bg-[#c5a059] text-[#1a0f06] px-8 py-4 font-bold rounded-sm hover:bg-[#e2c27d] transition-all flex items-center justify-center gap-2">
                MULAI BERMAIN <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative aspect-square border-2 border-[#c5a059]/30 p-4 rounded-full max-w-100 md:max-w-none mx-auto order-1 lg:order-2"
          >
            <img
              src="https://placehold.co/800x800/2d1b0e/c5a059?text=MOCKUP+TATA+KRAMA"
              alt="Hero Product"
              className="rounded-full w-full h-full object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Keunggulan */}
      <section id="keunggulan" className="py-20 bg-[#2d1b0e] relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif-royal text-center mb-12 text-[#c5a059]">Mengapa Tata Krama?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { t: "Nilai Budaya", d: "Desain Bregada & Ikonik Keraton", icon: "01" },
              { t: "Variatif", d: "Metode bermain menantang & unik", icon: "02" },
              { t: "Ramah Lingkungan", d: "Bahan kayu berkualitas tinggi", icon: "03" },
              { t: "Atraktif", d: "Warna & desain estetika tinggi", icon: "04" }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-[#1a0f06] p-8 border-t-4 border-[#c5a059] shadow-xl"
              >
                <span className="text-[#c5a059]/20 text-4xl font-bold block mb-4 italic">{item.icon}</span>
                <h3 className="text-lg font-bold mb-2 text-[#f5e6ca]">{item.t}</h3>
                <p className="text-sm text-[#f5e6ca]/60 leading-relaxed">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Barcode Scanner Section */}
      <section id="scanner" className="py-24 px-6 z-10 relative">
  <div className="max-w-5xl mx-auto">
    {/* Frame Utama dengan Shadow Dalam */}
    <div className="bg-[#2d1b0e] border border-[#c5a059]/30 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="grid md:grid-cols-2">

        {/* SISI KIRI: INSTRUKSI & VISUAL GUIDE */}
        <div className="p-10 md:p-16 space-y-10 bg-gradient-to-br from-[#2d1b0e] to-[#1a0f06] relative overflow-hidden">
          {/* Decorative Background Icon */}
          <ShoppingBag className="absolute -left-10 -bottom-10 w-48 h-48 text-[#c5a059]/5 -rotate-12" />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c5a059]/30 bg-[#c5a059]/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c5a059] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c5a059]"></span>
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#c5a059] uppercase">Interactive Mode</span>
            </div>
            
            <h2 className="text-4xl font-serif-royal text-[#f5e6ca] leading-tight">
              Pusat <span className="text-[#c5a059]">Informasi</span> Budaya
            </h2>
            
            <p className="text-[#f5e6ca]/60 text-sm leading-relaxed">
              Arahkan kamera pada kode QR yang tersedia untuk memvalidasi jawaban atau mendalami sejarah Keraton.
            </p>

            {/* Panduan Tipe QR */}
            <div className="grid gap-3">
              <div className="flex items-center gap-4 p-3 border border-red-800/30 bg-red-950/10 rounded-xl transition-all hover:bg-red-950/20">
                <div className="w-10 h-10 shrink-0 bg-red-700 flex items-center justify-center rounded-lg shadow-lg shadow-red-900/40">
                  <span className="text-white font-bold text-lg">?</span>
                </div>
                <div>
                  <p className="text-[11px] font-black text-red-500 uppercase tracking-widest">Kunci Jawaban</p>
                  <p className="text-[10px] text-[#f5e6ca]/50">Gunakan untuk memverifikasi tebakanmu.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 border border-[#c5a059]/30 bg-[#c5a059]/5 rounded-xl transition-all hover:bg-[#c5a059]/10">
                <div className="w-10 h-10 shrink-0 bg-[#c5a059] flex items-center justify-center rounded-lg shadow-lg shadow-[#c5a059]/20 text-[#1a0f06]">
                  <Info size={20} strokeWidth={3} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-[#c5a059] uppercase tracking-widest">Materi Sejarah</p>
                  <p className="text-[10px] text-[#f5e6ca]/50">Eksplorasi filosofi dan narasi budaya.</p>
                </div>
              </div>
            </div>

            {!isScanning && !scanResult && (
              <button
                onClick={() => setIsScanning(true)}
                className="w-full mt-4 bg-[#c5a059] text-[#1a0f06] py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-[#e2c27d] transition-all shadow-xl shadow-black/40 flex items-center justify-center gap-3"
              >
                <Camera size={18} /> AKTIFKAN SCANNER
              </button>
            )}
          </div>
        </div>

        {/* SISI KANAN: SCANNER / HASIL */}
        <div className="bg-[#120a04] p-8 flex items-center justify-center min-h-[500px] relative border-t md:border-t-0 md:border-l border-[#c5a059]/10">
          
          {/* Decorative L-Corners (Sesuai Cuplikan) */}
          <div className="absolute top-6 left-6 w-10 h-10 border-t-2 border-l-2 border-[#c5a059]/20"></div>
          <div className="absolute bottom-6 right-6 w-10 h-10 border-b-2 border-r-2 border-[#c5a059]/20"></div>

          {isScanning ? (
            <div className="w-full flex flex-col items-center gap-6">
              <div className="relative w-full max-w-[320px] aspect-square border-2 border-[#c5a059]/40 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(197,160,89,0.1)]">
                <div id="reader" className="w-full h-full"></div>
                {/* Scan Line Overlay */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent shadow-[0_0_15px_#c5a059] animate-scan-premium"></div>
                </div>
              </div>
              <button 
                onClick={() => setIsScanning(false)}
                className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em] flex items-center gap-2"
              >
                <X size={14} /> Batalkan
              </button>
            </div>
          ) : scanResult ? (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`w-full max-w-sm p-8 rounded-[2rem] border-2 shadow-2xl relative overflow-hidden ${
                  scanResult.category === 'jawaban' 
                  ? 'border-red-900/50 bg-gradient-to-b from-red-950/40 to-[#120a04]' 
                  : 'border-[#c5a059]/50 bg-gradient-to-b from-[#2d1b0e] to-[#120a04]'
                }`}
              >
                {/* Label Category */}
                <div className="flex justify-between items-center mb-6">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    scanResult.category === 'jawaban' ? 'bg-red-700 text-white' : 'bg-[#c5a059] text-[#1a0f06]'
                  }`}>
                    {scanResult.category}
                  </span>
                  <button onClick={() => setScanResult(null)} className="text-[#f5e6ca]/30 hover:text-white transition">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-serif-royal text-[#f5e6ca] leading-tight">
                    {scanResult.q}
                  </h3>

                  <div className="max-h-60 overflow-y-auto pr-4 custom-scrollbar text-sm leading-relaxed text-[#f5e6ca]/80 italic">
                    {scanResult.a.split('\\n').map((paragraph, idx) => {
                      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={idx} className="mb-4">
                          {parts.map((part, i) =>
                            part.startsWith('**') && part.endsWith('**')
                              ? <strong key={i} className="text-[#c5a059] font-bold uppercase tracking-tight not-italic">{part.replace(/\*\*/g, '')}</strong>
                              : part
                          )}
                        </p>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => { setScanResult(null); setIsScanning(true); }}
                    className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#f5e6ca] hover:bg-white/10 transition-all"
                  >
                    Scan Balok Lain
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#c5a059] blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <Camera size={80} className="relative mx-auto text-[#c5a059]/10 group-hover:text-[#c5a059]/30 transition-all duration-700 rotate-[-10deg] group-hover:rotate-0" />
              </div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#c5a059]/30 font-black">Awaiting Input</p>
            </div>
          )}
        </div>

      </div>
    </div>
  </div>
</section>

      {/* E-Commerce & Contact */}
      <section className="py-20 px-6 z-10 relative bg-[#f5e6ca]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          <div className="text-[#1a0f06]">
            <h2 className="text-3xl md:text-4xl font-serif-royal mb-8 text-center lg:text-left">Dapatkan Produk</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 border-2 border-[#1a0f06]/20 rounded-xl flex flex-col items-center gap-4 opacity-50">
                <ShoppingBag />
                <span className="font-bold">Shopee</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-[#1a0f06] text-white px-2 py-1">Soon</span>
              </div>
              <div className="p-6 border-2 border-[#1a0f06]/20 rounded-xl flex flex-col items-center gap-4 opacity-50">
                <ShoppingBag />
                <span className="font-bold">Tokopedia</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-[#1a0f06] text-white px-2 py-1">Soon</span>
              </div>
            </div>
          </div>

          <form className="bg-[#1a0f06] p-6 md:p-10 rounded-2xl shadow-2xl space-y-4">
            <h3 className="text-xl md:text-2xl font-serif-royal text-[#c5a059] mb-4">Hubungi Kami</h3>
            <input type="text" placeholder="Nama Lengkap" className="w-full bg-[#2d1b0e] border-none p-4 rounded-lg text-sm text-[#f5e6ca] focus:ring-1 focus:ring-[#c5a059] outline-none" />
            <input type="email" placeholder="Email" className="w-full bg-[#2d1b0e] border-none p-4 rounded-lg text-sm text-[#f5e6ca] focus:ring-1 focus:ring-[#c5a059] outline-none" />
            <textarea rows="3" placeholder="Pesan Anda" className="w-full bg-[#2d1b0e] border-none p-4 rounded-lg text-sm text-[#f5e6ca] focus:ring-1 focus:ring-[#c5a059] outline-none"></textarea>
            <button className="w-full bg-[#c5a059] text-[#1a0f06] font-bold py-4 rounded-lg flex items-center justify-center gap-2 text-sm">
              KIRIM PESAN <Send size={16} />
            </button>
          </form>
        </div>
      </section>

      <footer className="py-10 text-center border-t border-[#c5a059]/20 text-[#f5e6ca]/30 text-[10px] tracking-[0.2em] uppercase px-6">
        © 2026 TATA KRAMA - WARISAN BUDAYA DALAM PERMAINAN
      </footer>
    </div>
  );
};

export default App;