import React from 'react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section id="about" data-testid="about-section" className="py-24 md:py-32 bg-[#EADDD7]/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1587288672797-74093d795afc?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHx3YXJtJTIwY2FmZSUyMGludGVyaW9yJTIwd29vZHxlbnwwfHx8fDE3NzUyNDM5Nzh8MA&ixlib=rb-4.1.0&q=85"
                alt="Interior da Pasteçaria Degrau Azul"
                className="w-full aspect-[4/5] object-cover"
              />
              {/* Decorative border */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#C4A484]/40 -z-10" />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <p className="text-[#C4A484] text-xs tracking-[0.3em] uppercase font-medium mb-4">A nossa historia</p>
            <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] text-[#0A0F1A] tracking-tight mb-8 leading-[1.1]">
              Tradição com<br />
              <span className="italic font-normal">alma portuguesa</span>
            </h2>
            <div className="space-y-5 text-[#4A5568] leading-relaxed">
              <p>
                A Pasteçaria Degrau Azul nasceu do sonho de preservar os sabores autênticos da pastelaria portuguesa, 
                combinando receitas tradicionais com um toque contemporâneo.
              </p>
              <p>
                Cada produto é preparado diariamente com ingredientes frescos e selecionados, 
                seguindo as receitas que passam de geração em geração. O nosso espaço, decorado com 
                madeiras naturais e detalhes em azul marinho, convida a uma pausa reconfortante.
              </p>
              <p>
                Desde o primeiro pastel de nata da manhã até ao último café da tarde, 
                cada momento no Degrau Azul é uma celebração da arte pasteleira portuguesa.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-[#0B1D3A]/10">
              <div>
                <p className="text-3xl font-['Playfair_Display'] text-[#0B1D3A]">100%</p>
                <p className="text-xs tracking-[0.15em] uppercase text-[#718096] mt-1">Artesanal</p>
              </div>
              <div>
                <p className="text-3xl font-['Playfair_Display'] text-[#0B1D3A]">Diário</p>
                <p className="text-xs tracking-[0.15em] uppercase text-[#718096] mt-1">Fresco</p>
              </div>
              <div>
                <p className="text-3xl font-['Playfair_Display'] text-[#0B1D3A]">Local</p>
                <p className="text-xs tracking-[0.15em] uppercase text-[#718096] mt-1">Ingredientes</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
