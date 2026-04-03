import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Plus, Pencil, Trash2, MoreVertical, MessageSquare, UtensilsCrossed, Image, LayoutGrid, Mail, ShoppingBag, Eye } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Dialog states
  const [showCatDialog, setShowCatDialog] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [catForm, setCatForm] = useState({ name: '', description: '', order: 0 });
  const [itemForm, setItemForm] = useState({ name: '', description: '', price: '', category_id: '', image_url: '', available: true, featured: false });
  const [galleryForm, setGalleryForm] = useState({ image_url: '', caption: '', order: 0 });

  useEffect(() => {
    if (!authLoading && (!user || !user.id)) navigate('/admin');
  }, [user, authLoading, navigate]);

  const fetchData = useCallback(async () => {
    try {
      const [catRes, itemRes, msgRes, galRes] = await Promise.all([
        axios.get(`${API}/categories`),
        axios.get(`${API}/menu`),
        axios.get(`${API}/messages`, { withCredentials: true }),
        axios.get(`${API}/gallery`),
      ]);
      setCategories(catRes.data);
      setMenuItems(itemRes.data);
      setMessages(msgRes.data);
      setGallery(galRes.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { if (user && user.id) fetchData(); }, [user, fetchData]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  // Category CRUD
  const saveCat = async () => {
    try {
      if (editingCat) {
        await axios.put(`${API}/categories/${editingCat.id}`, catForm, { withCredentials: true });
        toast.success('Categoria atualizada');
      } else {
        await axios.post(`${API}/categories`, catForm, { withCredentials: true });
        toast.success('Categoria criada');
      }
      setShowCatDialog(false);
      setEditingCat(null);
      setCatForm({ name: '', description: '', order: 0 });
      fetchData();
    } catch { toast.error('Erro ao guardar categoria'); }
  };

  const deleteCat = async (id) => {
    if (!window.confirm('Eliminar esta categoria e todos os seus itens?')) return;
    try {
      await axios.delete(`${API}/categories/${id}`, { withCredentials: true });
      toast.success('Categoria eliminada');
      fetchData();
    } catch { toast.error('Erro ao eliminar'); }
  };

  // Menu item CRUD
  const saveItem = async () => {
    try {
      const payload = { ...itemForm, price: parseFloat(itemForm.price) };
      if (editingItem) {
        await axios.put(`${API}/menu/${editingItem.id}`, payload, { withCredentials: true });
        toast.success('Item atualizado');
      } else {
        await axios.post(`${API}/menu`, payload, { withCredentials: true });
        toast.success('Item criado');
      }
      setShowItemDialog(false);
      setEditingItem(null);
      setItemForm({ name: '', description: '', price: '', category_id: '', image_url: '', available: true, featured: false });
      fetchData();
    } catch { toast.error('Erro ao guardar item'); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Eliminar este item?')) return;
    try {
      await axios.delete(`${API}/menu/${id}`, { withCredentials: true });
      toast.success('Item eliminado');
      fetchData();
    } catch { toast.error('Erro ao eliminar'); }
  };

  // Gallery CRUD
  const saveGallery = async () => {
    try {
      await axios.post(`${API}/gallery`, galleryForm, { withCredentials: true });
      toast.success('Imagem adicionada');
      setShowGalleryDialog(false);
      setGalleryForm({ image_url: '', caption: '', order: 0 });
      fetchData();
    } catch { toast.error('Erro ao guardar'); }
  };

  const deleteGallery = async (id) => {
    if (!window.confirm('Eliminar esta imagem?')) return;
    try {
      await axios.delete(`${API}/gallery/${id}`, { withCredentials: true });
      toast.success('Imagem eliminada');
      fetchData();
    } catch { toast.error('Erro ao eliminar'); }
  };

  // Messages
  const markRead = async (id) => {
    try {
      await axios.put(`${API}/messages/${id}/read`, {}, { withCredentials: true });
      fetchData();
    } catch { toast.error('Erro'); }
  };

  const deleteMsg = async (id) => {
    try {
      await axios.delete(`${API}/messages/${id}`, { withCredentials: true });
      fetchData();
    } catch { toast.error('Erro'); }
  };

  const getCatName = (catId) => categories.find((c) => c.id === catId)?.name || '—';
  const unreadCount = messages.filter((m) => !m.read).length;

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]"><p className="text-[#718096]">A carregar...</p></div>;

  const tabs = [
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'categories', label: 'Categorias', icon: LayoutGrid },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare, badge: unreadCount },
    { id: 'gallery', label: 'Galeria', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6]" data-testid="admin-dashboard">
      {/* Top bar */}
      <header className="border-b border-[#0B1D3A]/10 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <a href="/" className="w-8 h-8 bg-[#0B1D3A] flex items-center justify-center">
              <span className="text-[#FAF9F6] font-['Playfair_Display'] text-sm font-semibold">DA</span>
            </a>
            <span className="text-sm font-medium text-[#0A0F1A]">Painel de Administração</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" rel="noreferrer" data-testid="admin-view-site" className="text-xs text-[#718096] hover:text-[#0B1D3A] flex items-center gap-1"><Eye size={14} /> Ver site</a>
            <button onClick={handleLogout} data-testid="admin-logout-button" className="flex items-center gap-2 text-xs text-[#718096] hover:text-[#0B1D3A] transition-colors">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8" data-testid="admin-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              data-testid={`admin-tab-${t.id}`}
              className={`flex items-center gap-2 px-5 py-3 text-xs tracking-[0.1em] uppercase font-medium border transition-all ${
                activeTab === t.id
                  ? 'bg-[#0B1D3A] text-[#FAF9F6] border-[#0B1D3A]'
                  : 'bg-transparent text-[#4A5568] border-[#0B1D3A]/15 hover:border-[#0B1D3A]/30'
              }`}
            >
              <t.icon size={14} />
              {t.label}
              {t.badge > 0 && (
                <Badge variant="destructive" className="ml-1 text-[10px] px-1.5 py-0 rounded-full">{t.badge}</Badge>
              )}
            </button>
          ))}
        </div>

        {/* MENU TAB */}
        {activeTab === 'menu' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] text-[#0A0F1A]">Itens do Menu</h2>
              <button
                onClick={() => { setEditingItem(null); setItemForm({ name: '', description: '', price: '', category_id: categories[0]?.id || '', image_url: '', available: true, featured: false }); setShowItemDialog(true); }}
                data-testid="admin-add-item-button"
                className="flex items-center gap-2 px-4 py-2 bg-[#0B1D3A] text-[#FAF9F6] text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#0B1D3A]/90 transition-all"
              >
                <Plus size={14} /> Novo Item
              </button>
            </div>
            <div className="border border-[#0B1D3A]/10 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#EADDD7]/30">
                    <TableHead className="text-xs tracking-[0.1em] uppercase text-[#718096]">Nome</TableHead>
                    <TableHead className="text-xs tracking-[0.1em] uppercase text-[#718096]">Categoria</TableHead>
                    <TableHead className="text-xs tracking-[0.1em] uppercase text-[#718096]">Preço</TableHead>
                    <TableHead className="text-xs tracking-[0.1em] uppercase text-[#718096]">Estado</TableHead>
                    <TableHead className="text-xs tracking-[0.1em] uppercase text-[#718096] w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-[#EADDD7]/10">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.image_url && <img src={item.image_url} alt="" className="w-10 h-10 object-cover" />}
                          <div>
                            <p className="font-medium text-[#0A0F1A] text-sm">{item.name}</p>
                            {item.featured && <Badge className="text-[10px] bg-[#C4A484] text-white mt-1">Destaque</Badge>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-[#4A5568]">{getCatName(item.category_id)}</TableCell>
                      <TableCell className="text-sm font-medium text-[#0B1D3A]">{item.price.toFixed(2)}€</TableCell>
                      <TableCell>
                        <Badge variant={item.available ? 'default' : 'secondary'} className={`text-[10px] ${item.available ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}`}>
                          {item.available ? 'Disponivel' : 'Indisponivel'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger data-testid={`menu-item-actions-${item.id}`} className="p-1 hover:bg-[#EADDD7]/30 rounded">
                            <MoreVertical size={16} className="text-[#718096]" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setEditingItem(item); setItemForm({ name: item.name, description: item.description || '', price: String(item.price), category_id: item.category_id, image_url: item.image_url || '', available: item.available, featured: item.featured || false }); setShowItemDialog(true); }}>
                              <Pencil size={14} className="mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteItem(item.id)} className="text-red-600">
                              <Trash2 size={14} className="mr-2" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] text-[#0A0F1A]">Categorias</h2>
              <button
                onClick={() => { setEditingCat(null); setCatForm({ name: '', description: '', order: 0 }); setShowCatDialog(true); }}
                data-testid="admin-add-category-button"
                className="flex items-center gap-2 px-4 py-2 bg-[#0B1D3A] text-[#FAF9F6] text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#0B1D3A]/90 transition-all"
              >
                <Plus size={14} /> Nova Categoria
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="border border-[#0B1D3A]/10 p-6 hover:border-[#0B1D3A]/25 transition-all" data-testid={`admin-category-${cat.id}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-['Playfair_Display'] text-lg text-[#0A0F1A]">{cat.name}</h3>
                      {cat.description && <p className="text-sm text-[#718096] mt-1">{cat.description}</p>}
                      <p className="text-xs text-[#C4A484] mt-2">{menuItems.filter((i) => i.category_id === cat.id).length} itens</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1 hover:bg-[#EADDD7]/30 rounded"><MoreVertical size={16} className="text-[#718096]" /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditingCat(cat); setCatForm({ name: cat.name, description: cat.description || '', order: cat.order }); setShowCatDialog(true); }}>
                          <Pencil size={14} className="mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteCat(cat.id)} className="text-red-600">
                          <Trash2 size={14} className="mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div>
            <h2 className="text-2xl font-['Playfair_Display'] text-[#0A0F1A] mb-6">Mensagens</h2>
            {messages.length === 0 ? (
              <p className="text-[#718096] text-center py-12">Nenhuma mensagem recebida.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`border p-6 transition-all ${msg.read ? 'border-[#0B1D3A]/10 bg-transparent' : 'border-[#0B1D3A]/20 bg-[#EADDD7]/15'}`} data-testid={`admin-message-${msg.id}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`text-[10px] ${msg.type === 'order' ? 'bg-[#C4A484] text-white hover:bg-[#C4A484]' : 'bg-[#0B1D3A] text-[#FAF9F6] hover:bg-[#0B1D3A]'}`}>
                            {msg.type === 'order' ? <><ShoppingBag size={10} className="mr-1" /> Encomenda</> : <><Mail size={10} className="mr-1" /> Contacto</>}
                          </Badge>
                          {!msg.read && <Badge variant="destructive" className="text-[10px]">Novo</Badge>}
                        </div>
                        <p className="font-medium text-[#0A0F1A] text-sm">{msg.name}</p>
                        <p className="text-xs text-[#718096]">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                        <p className="text-sm text-[#4A5568] mt-3 leading-relaxed">{msg.message}</p>
                        <p className="text-xs text-[#718096] mt-3">{new Date(msg.created_at).toLocaleString('pt-PT')}</p>
                      </div>
                      <div className="flex gap-2">
                        {!msg.read && (
                          <button onClick={() => markRead(msg.id)} className="p-2 text-[#718096] hover:text-[#0B1D3A] transition-colors" title="Marcar como lido">
                            <Eye size={16} />
                          </button>
                        )}
                        <button onClick={() => deleteMsg(msg.id)} className="p-2 text-[#718096] hover:text-red-600 transition-colors" title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-['Playfair_Display'] text-[#0A0F1A]">Galeria</h2>
              <button
                onClick={() => { setGalleryForm({ image_url: '', caption: '', order: 0 }); setShowGalleryDialog(true); }}
                data-testid="admin-add-gallery-button"
                className="flex items-center gap-2 px-4 py-2 bg-[#0B1D3A] text-[#FAF9F6] text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#0B1D3A]/90 transition-all"
              >
                <Plus size={14} /> Nova Imagem
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="group relative border border-[#0B1D3A]/10 overflow-hidden" data-testid={`admin-gallery-${item.id}`}>
                  <img src={item.image_url} alt={item.caption} className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-[#0B1D3A]/0 group-hover:bg-[#0B1D3A]/40 transition-all flex items-center justify-center">
                    <button onClick={() => deleteGallery(item.id)} className="opacity-0 group-hover:opacity-100 p-3 bg-red-600 text-white transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {item.caption && <p className="p-2 text-xs text-[#718096]">{item.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Dialog */}
      <Dialog open={showCatDialog} onOpenChange={setShowCatDialog}>
        <DialogContent className="rounded-none border-[#0B1D3A]/15">
          <DialogHeader>
            <DialogTitle className="font-['Playfair_Display']">{editingCat ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Nome</Label>
              <Input data-testid="cat-name-input" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className="rounded-none border-[#0B1D3A]/15" />
            </div>
            <div>
              <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Descrição</Label>
              <Input data-testid="cat-desc-input" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} className="rounded-none border-[#0B1D3A]/15" />
            </div>
            <div>
              <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Ordem</Label>
              <Input data-testid="cat-order-input" type="number" value={catForm.order} onChange={(e) => setCatForm({ ...catForm, order: parseInt(e.target.value) || 0 })} className="rounded-none border-[#0B1D3A]/15" />
            </div>
            <button onClick={saveCat} data-testid="cat-save-button" className="w-full py-3 bg-[#0B1D3A] text-[#FAF9F6] text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#0B1D3A]/90 transition-all">
              {editingCat ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="rounded-none border-[#0B1D3A]/15 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Playfair_Display']">{editingItem ? 'Editar Item' : 'Novo Item'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Nome</Label>
              <Input data-testid="item-name-input" value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} className="rounded-none border-[#0B1D3A]/15" />
            </div>
            <div>
              <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Descrição</Label>
              <Textarea data-testid="item-desc-input" value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} className="rounded-none border-[#0B1D3A]/15 resize-none" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Preço (€)</Label>
                <Input data-testid="item-price-input" type="number" step="0.01" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} className="rounded-none border-[#0B1D3A]/15" />
              </div>
              <div>
                <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Categoria</Label>
                <Select value={itemForm.category_id} onValueChange={(v) => setItemForm({ ...itemForm, category_id: v })}>
                  <SelectTrigger data-testid="item-category-select" className="rounded-none border-[#0B1D3A]/15">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">URL da Imagem</Label>
              <Input data-testid="item-image-input" value={itemForm.image_url} onChange={(e) => setItemForm({ ...itemForm, image_url: e.target.value })} className="rounded-none border-[#0B1D3A]/15" placeholder="https://..." />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-[#4A5568] cursor-pointer">
                <input type="checkbox" checked={itemForm.available} onChange={(e) => setItemForm({ ...itemForm, available: e.target.checked })} className="accent-[#0B1D3A]" />
                Disponivel
              </label>
              <label className="flex items-center gap-2 text-sm text-[#4A5568] cursor-pointer">
                <input type="checkbox" checked={itemForm.featured} onChange={(e) => setItemForm({ ...itemForm, featured: e.target.checked })} className="accent-[#0B1D3A]" />
                Destaque
              </label>
            </div>
            <button onClick={saveItem} data-testid="item-save-button" className="w-full py-3 bg-[#0B1D3A] text-[#FAF9F6] text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#0B1D3A]/90 transition-all">
              {editingItem ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
        <DialogContent className="rounded-none border-[#0B1D3A]/15">
          <DialogHeader>
            <DialogTitle className="font-['Playfair_Display']">Nova Imagem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">URL da Imagem</Label>
              <Input data-testid="gallery-url-input" value={galleryForm.image_url} onChange={(e) => setGalleryForm({ ...galleryForm, image_url: e.target.value })} className="rounded-none border-[#0B1D3A]/15" placeholder="https://..." />
            </div>
            <div>
              <Label className="text-xs tracking-[0.1em] uppercase text-[#718096] mb-2 block">Legenda</Label>
              <Input data-testid="gallery-caption-input" value={galleryForm.caption} onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })} className="rounded-none border-[#0B1D3A]/15" />
            </div>
            <button onClick={saveGallery} data-testid="gallery-save-button" className="w-full py-3 bg-[#0B1D3A] text-[#FAF9F6] text-xs tracking-[0.1em] uppercase font-medium hover:bg-[#0B1D3A]/90 transition-all">
              Adicionar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
