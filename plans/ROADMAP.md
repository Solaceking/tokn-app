# TOKN - Open Source Token Manager

A secure, open-source token/API key manager for developers.

---

## 🎯 Vision

Build the most developer-friendly, open-source token manager with:
- **Security First** - AES-256-GCM encryption, never store plain tokens
- **Open Source** - Free forever, donations optional (PayPal/Stripe)
- **One-Click Deploy** - Deploy to Vercel in minutes
- **Privacy Focused** - Your tokens, your data, your control

---

## 📋 Roadmap

### Phase 1: MVP (Done ✅)

- [x] User authentication (Supabase Auth)
- [x] Token CRUD operations (Create, Read, Update, Delete)
- [x] Server-side encryption (AES-256-GCM)
- [x] Token parsing from text/code (AI-powered)
- [x] Dark/Light theme
- [x] Dashboard with stats
- [x] Activity logging
- [x] Export to .env

### Phase 2: Production Ready (Done ✅)

- [x] Connect Dashboard to API - Replace Zustand with real API
- [x] Token status tracking (Active/Expiring/Expired)
- [x] "Test Token" button - Verify tokens are still valid
- [x] Vercel one-click deploy button
- [x] README with installation instructions
- [x] Welcome Tutorial - First-time user onboarding
- [x] Help/Wiki Page - FAQ, features, security docs

### Phase 3: User Features (In Progress 🚧)

- [ ] User avatar/profile photo support
- [ ] Login stats - show who's logged in on all screens
- [ ] Passkey/WebAuthn support (via Supabase)
- [ ] Team collaboration (invite team members)

### Phase 4: Advanced Features (Planned 📝)

- [ ] Token auto-rotation detection (manual check, not auto-rotate)
- [ ] Usage analytics dashboard
- [ ] Audit logs for compliance
- [ ] Browser extension
- [ ] CLI tool
- [ ] Mobile app (React Native)

### Phase 5: Enterprise (Future 🚀)

- [ ] SSO/SAML integration
- [ ] Custom branding
- [ ] Priority support tiers
- [ ] On-premise deployment option

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Supabase) |
| Auth | Supabase Auth (Email + Passkeys) |
| Encryption | AES-256-GCM |
| Deployment | Vercel |

---

## 📁 Project Structure

```
tokn-app/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── parser/       # Token parser page
│   │   ├── settings/     # Settings page
│   │   ├── help/         # Help/Wiki page
│   │   └── auth/         # Auth callbacks
│   ├── components/
│   │   ├── tokens/       # Token-related components
│   │   ├── layout/      # Layout components (Header)
│   │   └── ui/          # UI components (shadcn)
│   └── lib/
│       ├── encryption.ts       # Client-side encryption helpers
│       ├── server-encryption.ts # Server-side encryption
│       ├── supabase.ts        # Supabase client
│       └── db.ts              # Prisma client
├── prisma/
│   └── schema.prisma    # Database schema
└── public/
```

---

## 🔐 Security

### Current Security Measures

- **AES-256-GCM Encryption** - All tokens encrypted at rest
- **Server-side decryption** - Only decrypt when needed
- **Supabase Auth** - Secure session management
- **Environment variables** - Encryption key stored in Vercel env vars
- **No tracking** - No analytics, no external services

### Best Practices for Deployment

1. Set `ENCRYPTION_KEY` in Vercel environment variables
2. Use Supabase Row Level Security (RLS)
3. Enable HTTPS only in production
4. Regular security audits

---

## 🚀 Deployment

### One-Click Deploy to Vercel

```bash
# 1. Fork this repository
# 2. Go to https://vercel.com
# 3. Click "Deploy"
# 4. Add environment variables:
#    - ENCRYPTION_KEY (generate via: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - SUPABASE_SERVICE_ROLE_KEY
```

### Manual Deployment

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Run locally
npm run dev
```

---

## 💰 Monetization (Optional)

This is an **open source** project. To support development:

1. **GitHub Sponsors**
2. **PayPal Donations** - "Buy me a coffee"
3. **Stripe Donations**
4. **Premium Hosting** - Offer managed hosting for non-technical users ($5-19/mo)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a PR

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Open source Firebase alternative
- [shadcn/ui](https://ui.shadcn.com) - Beautiful components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
