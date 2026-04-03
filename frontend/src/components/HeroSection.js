import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="hero" data-testid="hero-section" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1764486601113-a6856cdce5fd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYWtlcnklMjBzdG9yZWZyb250fGVufDB8fHx8MTc3NTI0Mzk5OXww&ixlib=rb-4.1.0&q=85"
          alt="Pasteçaria Degrau Azul"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1D3A]/80 via-[#0B1D3A]/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <p className="text-[#C4A484] text-xs tracking-[0.3em] uppercase font-medium mb-6">
            Pasteçaria Artesanal
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-['Playfair_Display'] text-[#FAF9F6] tracking-tight leading-[1.1] mb-6">
            Degrau<br />
            <span className="italic font-normal">Azul</span>
          </h1>
          <p className="text-[#FAF9F6]/80 text-base md:text-lg font-light leading-relaxed mb-10 max-w-lg">
            Onde a tradição portuguesa encontra o sabor artesanal. Cada pastel é feito com paixão, cada café com perfeição.
          </p>
          <div className="flex gap-4">
            <a
              href="#menu"
              data-testid="hero-menu-button"
              className="inline-flex items-center px-8 py-4 bg-[#FAF9F6] text-[#0B1D3A] text-sm tracking-[0.15em] uppercase font-medium hover:bg-[#EADDD7] transition-all duration-300"
            >
              Ver Menu
            </a>
            <a
              href="#contact"
              data-testid="hero-contact-button"
              className="inline-flex items-center px-8 py-4 border border-[#FAF9F6]/40 text-[#FAF9F6] text-sm tracking-[0.15em] uppercase font-medium hover:bg-[#FAF9F6]/10 transition-all duration-300"
            >
              Encomendar
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#FAF9F6]/60"
      >
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
}
