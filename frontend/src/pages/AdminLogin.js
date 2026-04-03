import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function formatApiErrorDetail(detail) {
  if (detail == null) return 'Algo correu mal. Tente novamente.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((e) => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e))).filter(Boolean).join(' ');
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect
  React.useEffect(() => {
    if (user && user.id) navigate('/admin/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-12">
          <a href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#0B1D3A] flex items-center justify-center">
              <span className="text-[#FAF9F6] font-['Playfair_Display'] text-xl font-semibold">DA</span>
            </div>
          </a>
          <h1 className="text-3xl font-['Playfair_Display'] text-[#0A0F1A] tracking-tight mb-2">Administração</h1>
          <p className="text-sm text-[#718096]">Aceda ao painel de gestão</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
          <div>
            <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Email</Label>
            <Input
              data-testid="admin-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@degrauazul.pt"
              className="rounded-none border-[#0B1D3A]/15 focus:border-[#0B1D3A] focus:ring-[#0B1D3A] bg-transparent"
              required
            />
          </div>
          <div>
            <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Password</Label>
            <Input
              data-testid="admin-password-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-none border-[#0B1D3A]/15 focus:border-[#0B1D3A] focus:ring-[#0B1D3A] bg-transparent"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-submit"
            className="w-full py-4 bg-[#0B1D3A] text-[#FAF9F6] text-xs tracking-[0.15em] uppercase font-medium hover:bg-[#0B1D3A]/90 transition-all disabled:opacity-50"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center mt-8">
          <a href="/" data-testid="admin-back-link" className="text-xs text-[#718096] hover:text-[#0B1D3A] transition-colors">
            &larr; Voltar ao website
          </a>
        </p>
      </div>
    </div>
  );
}
