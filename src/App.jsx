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

  // Logika Scanner
  useEffect(() => {
  let scanner = null;
  if (isScanning) {
    // Menambah FPS dan menyesuaikan ukuran box untuk mobile
    scanner = new Html5QrcodeScanner("reader", { 
      fps: 20, // Lebih halus
      qrbox: { width: 250, height: 250 }, // Box area deteksi yang jelas
      aspectRatio: 1.0 // Kotak sempurna
    });
    
    scanner.render((text) => {
      const id = text.includes('/') ? text.split('/').pop() : text;
      const result = remoteDatabase[id] || { 
        q: "Data tidak ditemukan", 
        a: "Pastikan Anda men-scan barcode resmi Tata Krama." 
      };
      setScanResult(result);
      setIsScanning(false);
      scanner.clear();
    }, (err) => {
      // Biarkan kosong untuk menghindari spam di konsol
    });
  }
  return () => scanner?.clear();
}, [isScanning, remoteDatabase]);


  useEffect(() => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const transformedData = results.data.reduce((acc, row) => {
          if (row.id) {
            acc[row.id] = { q: row.q, a: row.a };
          }
          return acc;
        }, {});
        setRemoteDatabase(transformedData);
      },
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

      {/* Barcode Scanner */}
      <section id="scanner" className="py-20 px-6 z-10 relative">
        <div className="max-w-4xl mx-auto bg-[#2d1b0e] border border-[#c5a059]/40 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 space-y-6">
              <h2 className="text-2xl md:text-3xl font-serif-royal text-[#c5a059]">Kunci Jawaban Budaya</h2>
              <p className="text-sm opacity-80 leading-relaxed">
                Temukan pertanyaan pada balok permainanmu, aktifkan kamera, dan scan barcode.
              </p>
              
              {!isScanning && !scanResult && (
                <button 
                  onClick={() => setIsScanning(true)}
                  className="w-full flex items-center justify-center gap-3 bg-[#c5a059] text-[#1a0f06] py-4 font-bold rounded-xl hover:scale-[1.02] transition"
                >
                  <Camera size={20} /> AKTIFKAN SCANNER
                </button>
              )}
            </div>

            <div className="bg-[#1a0f06] p-4 flex items-center justify-center min-h-87.5 border-t md:border-t-0 md:border-l border-[#c5a059]/20">
              {isScanning ? (
                <div className="w-full h-full relative flex flex-col items-center">
                  <div id="reader" className="w-full overflow-hidden rounded-lg"></div>
                  <button 
                    onClick={() => setIsScanning(false)}
                    className="mt-4 text-xs text-red-400 font-bold uppercase tracking-widest"
                  >
                    Batal Scan
                  </button>
                </div>
              ) : scanResult ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 w-full">
                  <div className="space-y-4 p-5 bg-[#2d1b0e] border border-[#c5a059] rounded-xl">
                    <div>
                      <p className="text-[10px] font-bold text-[#c5a059] uppercase mb-1">Pertanyaan:</p>
                      <p className="text-sm italic text-[#f5e6ca]">"{scanResult.q}"</p>
                    </div>
                    <div className="pt-3 border-t border-[#c5a059]/20">
                      <p className="text-[10px] font-bold text-[#c5a059] uppercase mb-1">Penjelasan:</p>
                      <p className="text-sm leading-relaxed text-[#f5e6ca]/90">{scanResult.a}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {setScanResult(null); setIsScanning(true);}}
                    className="w-full mt-4 py-3 text-xs font-bold text-[#c5a059] border border-[#c5a059]/30 rounded-lg"
                  >
                    Scan Pertanyaan Lain
                  </button>
                </motion.div>
              ) : (
                <div className="text-center opacity-20">
                  <Camera size={60} className="mx-auto mb-4" />
                  <p className="text-[10px] tracking-[0.2em] uppercase">Kamera Siap</p>
                </div>
              )}
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