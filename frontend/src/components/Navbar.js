import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ChevronUp } from 'lucide-react';

const navLinks = [
  { label: 'Inicio', href: '#hero' },
  { label: 'Menu', href: '#menu' },
  { label: 'Sobre', href: '#about' },
  { label: 'Galeria', href: '#gallery' },
  { label: 'Localização', href: '#location' },
  { label: 'Contacto', href: '#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        data-testid="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'backdrop-blur-xl bg-[#FAF9F6]/80 border-b border-[#0B1D3A]/10 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
          <a href="#hero" data-testid="nav-logo" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0B1D3A] flex items-center justify-center">
              <span className="text-[#FAF9F6] font-['Playfair_Display'] text-lg font-semibold">DA</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-['Playfair_Display'] text-[#0A0F1A] text-lg tracking-tight leading-tight">Degrau Azul</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#718096] font-medium">Pasteçaria</p>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-${l.label.toLowerCase()}-link`}
                className="text-sm tracking-[0.1em] uppercase text-[#4A5568] hover:text-[#0B1D3A] transition-colors duration-200 font-medium"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            data-testid="nav-mobile-toggle"
            className="md:hidden p-2 text-[#0A0F1A]"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-[#FAF9F6]/95 backdrop-blur-xl border-b border-[#0B1D3A]/10 px-6 pb-6"
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-testid={`nav-mobile-${l.label.toLowerCase()}-link`}
                onClick={() => setOpen(false)}
                className="block py-3 text-sm tracking-[0.1em] uppercase text-[#4A5568] hover:text-[#0B1D3A] font-medium border-b border-[#0B1D3A]/5 last:border-0"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Back to top */}
      {showTop && (
        <button
          data-testid="back-to-top-button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#0B1D3A] text-[#FAF9F6] flex items-center justify-center hover:bg-[#0B1D3A]/90 transition-all shadow-lg"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </>
  );
}
