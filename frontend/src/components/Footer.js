import React from 'react';
import { Instagram, Facebook, Mail, Phone, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer data-testid="footer" className="relative">
      {/* Marquee ribbon */}
      <div className="bg-[#EADDD7] py-4 overflow-hidden border-y border-[#0B1D3A]/10">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="mx-8 text-sm tracking-[0.2em] text-[#0B1D3A]/60 font-['Playfair_Display'] italic">
              Artesanal &nbsp; • &nbsp; Fresco Diariamente &nbsp; • &nbsp; Tradição Portuguesa &nbsp; • &nbsp; Qualidade Premium &nbsp; • &nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div
        className="relative"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/5912576/pexels-photo-5912576.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#0B1D3A]/92" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#FAF9F6] flex items-center justify-center">
                  <span className="text-[#0B1D3A] font-['Playfair_Display'] text-lg font-semibold">DA</span>
                </div>
                <div>
                  <p className="font-['Playfair_Display'] text-[#FAF9F6] text-lg">Degrau Azul</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#FAF9F6]/50 font-medium">Pasteçaria</p>
                </div>
              </div>
              <p className="text-[#FAF9F6]/60 text-sm leading-relaxed max-w-xs">
                Onde a tradição portuguesa encontra o sabor artesanal. Visite-nos e descubra os nossos sabores.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#C4A484] font-medium mb-6">Links</p>
              <div className="space-y-3">
                {['Menu', 'Sobre', 'Galeria', 'Localização', 'Contacto'].map((l) => (
                  <a
                    key={l}
                    href={`#${l.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
                    data-testid={`footer-link-${l.toLowerCase()}`}
                    className="flex items-center gap-2 text-[#FAF9F6]/70 text-sm hover:text-[#FAF9F6] transition-colors group"
                  >
                    {l}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            {/* Contact & Social */}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#C4A484] font-medium mb-6">Contactos</p>
              <div className="space-y-3 text-[#FAF9F6]/70 text-sm">
                <div className="flex items-center gap-3">
                  <Phone size={14} />
                  <span>+351 912 345 678</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={14} />
                  <span>geral@degrauazul.pt</span>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-instagram-link"
                  className="w-10 h-10 border border-[#FAF9F6]/20 flex items-center justify-center text-[#FAF9F6]/60 hover:text-[#FAF9F6] hover:border-[#FAF9F6]/50 transition-all"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-facebook-link"
                  className="w-10 h-10 border border-[#FAF9F6]/20 flex items-center justify-center text-[#FAF9F6]/60 hover:text-[#FAF9F6] hover:border-[#FAF9F6]/50 transition-all"
                >
                  <Facebook size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-[#FAF9F6]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[#FAF9F6]/40 text-xs">
              &copy; {new Date().getFullYear()} Pasteçaria Degrau Azul. Todos os direitos reservados.
            </p>
            <a
              href="/admin"
              data-testid="footer-admin-link"
              className="text-[#FAF9F6]/30 text-xs hover:text-[#FAF9F6]/50 transition-colors"
            >
              Administração
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
