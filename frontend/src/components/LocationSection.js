import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone } from 'lucide-react';

export default function LocationSection() {
  return (
    <section id="location" data-testid="location-section" className="py-24 md:py-32 bg-[#EADDD7]/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#C4A484] text-xs tracking-[0.3em] uppercase font-medium mb-4">Onde estamos</p>
          <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] text-[#0A0F1A] tracking-tight">Localização</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-[#0B1D3A] flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#FAF9F6]" />
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-lg text-[#0A0F1A] mb-1">Morada</h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  Rua da Pastelaria, 123<br />
                  1100-001 Lisboa, Portugal
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-[#0B1D3A] flex items-center justify-center flex-shrink-0">
                <Clock size={18} className="text-[#FAF9F6]" />
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-lg text-[#0A0F1A] mb-1">Horário</h3>
                <div className="text-[#4A5568] text-sm leading-relaxed space-y-1">
                  <p>Segunda a Sexta: 07:00 - 20:00</p>
                  <p>Sábado: 08:00 - 20:00</p>
                  <p>Domingo: 08:00 - 14:00</p>
                </div>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-[#0B1D3A] flex items-center justify-center flex-shrink-0">
                <Phone size={18} className="text-[#FAF9F6]" />
              </div>
              <div>
                <h3 className="font-['Playfair_Display'] text-lg text-[#0A0F1A] mb-1">Contacto</h3>
                <p className="text-[#4A5568] text-sm leading-relaxed">
                  +351 912 345 678<br />
                  geral@degrauazul.pt
                </p>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            data-testid="google-maps-embed"
          >
            <div className="w-full aspect-[4/3] border border-[#0B1D3A]/10">
              <iframe
                title="Localização Pasteçaria Degrau Azul"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.1!2d-9.14!3d38.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDQyJzM2LjAiTiA5wrAwOCcyNC4wIlc!5e0!3m2!1spt-PT!2spt!4v1700000000000!5m2!1spt-PT!2spt"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
