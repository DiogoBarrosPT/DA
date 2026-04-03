import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', type: 'contact' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Por favor preencha todos os campos obrigatorios.');
      return;
    }
    setSending(true);
    try {
      await axios.post(`${API}/messages`, form);
      toast.success('Mensagem enviada com sucesso! Entraremos em contacto brevemente.');
      setForm({ name: '', email: '', phone: '', message: '', type: 'contact' });
    } catch {
      toast.error('Erro ao enviar a mensagem. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" data-testid="contact-section" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#C4A484] text-xs tracking-[0.3em] uppercase font-medium mb-4">Fale connosco</p>
            <h2 className="text-4xl sm:text-5xl font-['Playfair_Display'] text-[#0A0F1A] tracking-tight mb-6 leading-[1.1]">
              Contacto &<br />
              <span className="italic font-normal">Encomendas</span>
            </h2>
            <p className="text-[#4A5568] leading-relaxed mb-8">
              Quer fazer uma encomenda especial ou tem alguma questão? 
              Envie-nos uma mensagem e responderemos o mais brevemente possivel.
            </p>
            <div
              className="relative p-8 border border-[#0B1D3A]/10"
              style={{
                backgroundImage: `url(https://images.pexels.com/photos/5912576/pexels-photo-5912576.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-[#0B1D3A]/85" />
              <div className="relative text-[#FAF9F6]">
                <p className="font-['Playfair_Display'] text-xl mb-4">Encomendas Especiais</p>
                <p className="text-sm text-[#FAF9F6]/80 leading-relaxed">
                  Festas, eventos, casamentos ou simplesmente um mimo especial — 
                  aceitamos encomendas com pelo menos 48 horas de antecedência.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              {/* Type selector */}
              <div className="flex gap-3">
                <button
                  type="button"
                  data-testid="contact-type-contact"
                  onClick={() => setForm({ ...form, type: 'contact' })}
                  className={`flex-1 py-3 text-xs tracking-[0.15em] uppercase font-medium border transition-all ${
                    form.type === 'contact'
                      ? 'bg-[#0B1D3A] text-[#FAF9F6] border-[#0B1D3A]'
                      : 'bg-transparent text-[#4A5568] border-[#0B1D3A]/15'
                  }`}
                >
                  Contacto
                </button>
                <button
                  type="button"
                  data-testid="contact-type-order"
                  onClick={() => setForm({ ...form, type: 'order' })}
                  className={`flex-1 py-3 text-xs tracking-[0.15em] uppercase font-medium border transition-all ${
                    form.type === 'order'
                      ? 'bg-[#0B1D3A] text-[#FAF9F6] border-[#0B1D3A]'
                      : 'bg-transparent text-[#4A5568] border-[#0B1D3A]/15'
                  }`}
                >
                  Encomenda
                </button>
              </div>

              <div>
                <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Nome *</Label>
                <Input
                  data-testid="contact-name-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="O seu nome"
                  className="rounded-none border-[#0B1D3A]/15 focus:border-[#0B1D3A] focus:ring-[#0B1D3A] bg-transparent"
                />
              </div>

              <div>
                <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Email *</Label>
                <Input
                  data-testid="contact-email-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@exemplo.pt"
                  className="rounded-none border-[#0B1D3A]/15 focus:border-[#0B1D3A] focus:ring-[#0B1D3A] bg-transparent"
                />
              </div>

              <div>
                <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Telefone</Label>
                <Input
                  data-testid="contact-phone-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+351 912 345 678"
                  className="rounded-none border-[#0B1D3A]/15 focus:border-[#0B1D3A] focus:ring-[#0B1D3A] bg-transparent"
                />
              </div>

              <div>
                <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Mensagem *</Label>
                <Textarea
                  data-testid="contact-message-input"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={form.type === 'order' ? 'Descreva a sua encomenda (produtos, quantidade, data de entrega...)' : 'A sua mensagem...'}
                  rows={5}
                  className="rounded-none border-[#0B1D3A]/15 focus:border-[#0B1D3A] focus:ring-[#0B1D3A] bg-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                data-testid="contact-submit-button"
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#0B1D3A] text-[#FAF9F6] text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#0B1D3A]/90 transition-all disabled:opacity-50"
              >
                <Send size={14} />
                {sending ? 'A enviar...' : 'Enviar Mensagem'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
