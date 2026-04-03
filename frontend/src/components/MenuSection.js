import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function MenuSection() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemRes] = await Promise.all([
          axios.get(`${API}/categories`),
          axios.get(`${API}/menu`),
        ]);
        setCategories(catRes.data);
        setItems(itemRes.data);
        if (catRes.data.length > 0) setActiveCategory(catRes.data[0].id);
      } catch (e) {
        console.error('Error fetching menu:', e);
      }
    };
    fetchData();
  }, []);

  const filteredItems = activeCategory
    ? items.filter((i) => i.category_id === activeCategory && i.available)
    : items.filter((i) => i.available);

  return (
    <section id="menu" data-testid="menu-section" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#C4A484] text-xs tracking-[0.3em] uppercase font-medium mb-4">A nossa carta</p>
          <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] text-[#0A0F1A] tracking-tight">Menu</h2>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16" data-testid="menu-categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              data-testid={`menu-category-${cat.name.toLowerCase()}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 border ${
                activeCategory === cat.id
                  ? 'bg-[#0B1D3A] text-[#FAF9F6] border-[#0B1D3A]'
                  : 'bg-transparent text-[#4A5568] border-[#0B1D3A]/15 hover:border-[#0B1D3A]/40'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, i) => (
            <motion.div
              key={item.id}
              custom={i}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              data-testid={`menu-item-${item.id}`}
              className="group border border-[#0B1D3A]/10 hover:border-[#0B1D3A]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-[#FAF9F6]"
            >
              {item.image_url && (
                <div className="overflow-hidden aspect-[4/3]">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-['Playfair_Display'] text-lg text-[#0A0F1A]">{item.name}</h3>
                  <span className="text-[#0B1D3A] font-medium text-lg whitespace-nowrap">
                    {item.price.toFixed(2)}€
                  </span>
                </div>
                {item.description && (
                  <p className="text-sm text-[#718096] leading-relaxed">{item.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p className="text-center text-[#718096] py-12">Nenhum item disponivel nesta categoria.</p>
        )}
      </div>
    </section>
  );
}
