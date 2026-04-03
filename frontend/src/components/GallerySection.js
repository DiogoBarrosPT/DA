import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function GallerySection() {
  const [gallery, setGallery] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios.get(`${API}/gallery`).then((r) => setGallery(r.data)).catch(console.error);
  }, []);

  if (gallery.length === 0) return null;

  return (
    <section id="gallery" data-testid="gallery-section" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#C4A484] text-xs tracking-[0.3em] uppercase font-medium mb-4">Momentos</p>
          <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] text-[#0A0F1A] tracking-tight">Galeria</h2>
        </motion.div>

        {/* Bento-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {gallery.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`group cursor-pointer overflow-hidden ${
                i === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              onClick={() => setSelected(item)}
              data-testid={`gallery-item-${i}`}
            >
              <div className="relative w-full h-full min-h-[200px] md:min-h-[280px]">
                <img
                  src={item.image_url}
                  alt={item.caption || 'Galeria'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-[#0B1D3A]/0 group-hover:bg-[#0B1D3A]/20 transition-all duration-500" />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0B1D3A]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-[#FAF9F6] text-sm font-light">{item.caption}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          {selected && (
            <img
              src={selected.image_url}
              alt={selected.caption || 'Galeria'}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
