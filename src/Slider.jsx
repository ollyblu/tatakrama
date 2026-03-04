import React, { useState, useEffect, useRef } from 'react';

import {
  Instagram, MessageCircle, Mail, Send,
  Camera, X, ShoppingBag, ChevronRight, Info, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// ... (import lainnya tetap sama)

// Tambahkan komponen MateriSlider ini di atas komponen App atau di file terpisah
const MateriSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const materiData = [
    { id: '01', title: "Bregada", desc: "Prajurit keraton yang melambangkan keberanian dan disiplin tinggi.", img: "./bregada.png" },
    { id: '02', title: "Busana", desc: "Kain batik dan beskap dengan filosofi mendalam di setiap motifnya.", img: "./busana.png" },
    { id: '03', title: "Papan", desc: "Eksplorasi arsitektur sakral Bangsal Kencono dan filosofi tata ruang.", img: "./papan.png" },
    { id: '04', title: "Regalia", desc: "Lambang kekuasaan raja berupa benda pusaka yang penuh makna.", img: "./regalia.png" }
  ];

  const handleNext = () => {
    if (activeIndex < materiData.length - 1) setActiveIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(prev => prev - 1);
  };

  return (
    <section className="py-32 px-6 bg-[#1a0f06] overflow-hidden relative">
      {/* Decorative Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-125 bg-[#c5a059]/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <span className="text-[#c5a059] font-bold tracking-[0.4em] text-[10px] uppercase">Ensiklopedi Visual</span>
            <h2 className="text-4xl md:text-5xl font-serif-royal text-[#f5e6ca]">Materi <span className="text-[#c5a059]">Utama</span></h2>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handlePrev}
              className={`w-12 h-12 flex items-center justify-center rounded-full border border-[#c5a059]/30 transition-all ${activeIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#c5a059] hover:text-[#1a0f06]'}`}
            >
              <ChevronRight className="rotate-180" size={20} />
            </button>
            <button 
              onClick={handleNext}
              className={`w-12 h-12 flex items-center justify-center rounded-full border border-[#c5a059]/30 transition-all ${activeIndex === materiData.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#c5a059] hover:text-[#1a0f06]'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Card Container */}
        <div className="relative overflow-visible">
          <motion.div 
            className="flex gap-8"
            drag="x"
            dragConstraints={{ right: 0, left: -600 }}
            animate={{ x: -activeIndex * (window.innerWidth < 768 ? 320 : 380) }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            {materiData.map((item) => (
              <motion.div
                key={item.id}
                className="relative min-w-70 md:min-w-87.5 h-120 rounded-[45px] p-10 flex flex-col justify-end overflow-visible group"
                style={{
                  background: 'linear-gradient(180deg, rgba(45, 27, 14, 0.8) 0%, rgba(18, 10, 4, 1) 100%)',
                  border: '1px solid rgba(197, 160, 89, 0.15)'
                }}
              >
                {/* Floating Image PNG */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-56 md:w-64 aspect-square z-20 transition-transform duration-500 group-hover:-translate-y-4 mt-20">
                  <div className="absolute inset-0 bg-[#c5a059]/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300/2d1b0e/c5a059?text=' + item.title }}
                  />
                </div>

                <span className="absolute top-10 right-10 text-[#c5a059]/20 font-serif-royal text-4xl italic">
                  {item.id}
                </span>

                <div className="relative z-10 space-y-5">
                  <h3 className="text-3xl font-serif-royal text-[#f5e6ca] tracking-wide">{item.title}</h3>
                  <p className="text-sm text-[#f5e6ca]/60 leading-relaxed font-light">
                    {item.desc}
                  </p>
                  <div className="pt-2">
                    <button className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase text-[#c5a059] group/btn transition-all">
                      <span className="border-b border-[#c5a059]/40 pb-1 group-hover/btn:border-[#c5a059] group-hover/btn:text-white transition-all">Pelajari Detail</span>
                      <div className="w-6 h-6 rounded-full bg-[#c5a059]/10 flex items-center justify-center group-hover/btn:bg-[#c5a059] group-hover/btn:text-[#1a0f06] transition-all">
                        <ChevronRight size={12} />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Inner Shadow / Glow Effect */}
                <div className="absolute inset-0 rounded-[45px] ring-1 ring-inset ring-white/5 group-hover:ring-[#c5a059]/30 transition-all pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default MateriSlider;