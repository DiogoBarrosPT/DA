# Pasteçaria Degrau Azul - PRD

## Problem Statement
Website para um café/pastelaria portuguesa chamado "Pasteçaria Degrau Azul". Website informativo com menu, sobre nós, galeria de fotos, localização com Google Maps, formulário de contacto/encomendas, links de redes sociais e painel de administração.

## Architecture
- **Backend**: FastAPI + MongoDB (motor async) + JWT auth
- **Frontend**: React + Tailwind CSS + Shadcn UI + Framer Motion
- **Database**: MongoDB (categories, menu_items, messages, gallery, users)

## User Personas
1. **Cliente** - Visita o site para ver menu, localização, horários, e enviar encomendas
2. **Admin** - Gere menu, categorias, mensagens e galeria através do painel admin

## Core Requirements
- Website vitrine elegante com estética de madeira, tons neutros e azul marinho
- Menu dinâmico com categorias e filtros
- Formulário de contacto/encomendas
- Galeria de fotos com lightbox
- Google Maps integrado
- Links de redes sociais
- Painel de administração protegido com JWT

## What's Been Implemented (2026-04-03)
- Hero section com imagem de fundo e CTAs
- Menu section com 4 categorias e 8 itens (dados seed)
- About Us section com história e estatísticas
- Gallery section com bento grid e lightbox
- Location section com Google Maps embed e informações de contacto
- Contact/Order form com tipo selector
- Footer com marquee ribbon, links e redes sociais
- Navbar glassmorphism sticky com scroll behavior
- Admin login (/admin) com JWT auth
- Admin dashboard (/admin/dashboard) com CRUD completo: menu, categorias, mensagens, galeria
- Dados iniciais seeded (4 categorias, 8 itens menu, 3 imagens galeria, 1 admin)
- Design: Playfair Display + Outfit fonts, navy blue (#0B1D3A) accents, pastel white (#FAF9F6), wood tones (#EADDD7, #C4A484)

## Prioritized Backlog
### P0 (Done)
- [x] Homepage com todas as secções
- [x] Menu dinâmico com categorias
- [x] Formulário de contacto/encomendas
- [x] Painel admin com CRUD
- [x] Autenticação JWT

### P1
- [ ] Upload de imagens (em vez de URLs)
- [ ] Notificações por email para encomendas
- [ ] SEO meta tags e Open Graph

### P2
- [ ] Sistema de reservas de mesa
- [ ] Blog/Notícias
- [ ] Programa de fidelidade
- [ ] Integração WhatsApp para encomendas
- [ ] Multi-idioma (PT/EN)

## Next Tasks
1. Adicionar upload de imagens para menu e galeria
2. Configurar meta tags SEO
3. Integrar notificações por email (SendGrid/Resend)
4. Personalizar localização real no Google Maps
