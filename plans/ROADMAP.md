# TOKN - Development Roadmap

## Current Application State (Updated: Feb 2026)

The TOKN app is a **Next.js 16** application for API token management with **multi-provider AI parsing**.

### ✅ Completed Features

- **Database**: Prisma schema with Token, UserAIProvider, Activity, ParseHistory models
- **Server Encryption**: AES-256-GCM with per-encryption IV
- **AI Providers**: Support for DeepSeek, OpenAI, Google Gemini, OpenRouter, Z.ai
- **Provider API**: `/api/providers` (CRUD), `/api/providers/models` (fetch models)
- **Token API**: Full CRUD with encryption at `/api/tokens`
- **AI Parser API**: `/api/parse/ai` with fallback to regex
- **Activity API**: `/api/activities` for logging
- **UI**: Provider settings component with dropdown workflow
- **Settings Page**: AI Providers tab integrated

### ⚠️ In Progress

- Frontend integration (connecting dashboard to API)
- Supabase Auth integration (currently uses NextAuth patterns)
- Testing (unit, integration, E2E)
- Production deployment

---

## Architecture

```mermaid
graph TB
    subgraph "Client (Browser)"
        UI[React Components]
        ProviderSettings[Provider Settings UI]
        Parser[Token Parser]
    end

    subgraph "Server (Next.js API)"
        TokenAPI[/api/tokens]
        ProviderAPI[/api/providers]
        ParseAPI[/api/parse/ai]
        Encrypt[Server Encryption]
    end

    subgraph "Database (PostgreSQL/Supabase)"
        Tokens[Token Table]
        Providers[UserAIProvider Table]
        Activities[Activity Table]
    end

    subgraph "External AI Providers"
        DeepSeek[DeepSeek]
        OpenAI[OpenAI]
        Google[Google Gemini]
        OpenRouter[OpenRouter]
    end

    UI -->|HTTP| TokenAPI
    UI -->|HTTP| ProviderAPI
    UI -->|HTTP| ParseAPI
    TokenAPI -->|CRUD| Tokens
    ProviderAPI -->|CRUD| Providers
    ParseAPI -->|Proxy| DeepSeek
    ParseAPI -->|Proxy| OpenAI
    ParseAPI -->|Proxy| Google
    ParseAPI -->|Proxy| OpenRouter
    TokenAPI -->|Encrypt| Encrypt
```

---

## Current Roadmap

### Phase 1: Foundation ✅ COMPLETED
- [x] Prisma schema with Token, UserAIProvider, Activity, ParseHistory
- [x] AES-256-GCM server encryption
- [x] AI Provider types and configs
- [x] Provider service layer
- [x] API endpoints for providers, tokens, activities, parsing
- [x] Settings UI with provider management

### Phase 2: Frontend Integration 🔄 IN PROGRESS
- [ ] Connect dashboard to `/api/tokens`
- [ ] Replace Zustand localStorage with React Query + API
- [ ] Integrate Supabase Auth properly
- [ ] Add loading states and error handling

### Phase 3: Security & Polish
- [ ] Add Row Level Security (RLS) policies
- [ ] Add rate limiting
- [ ] Input validation (Zod schemas)
- [ ] Error boundaries

### Phase 4: Testing
- [ ] Unit tests (Vitest) - encryption, parsers
- [ ] Integration tests - API routes
- [ ] E2E tests (Playwright) - critical flows
- [ ] Security audit

### Phase 5: Deployment
- [ ] Configure Vercel environment vars
- [ ] Run Prisma migrations
- [ ] Deploy to production
- [ ] Verify all features work

---

## Environment Variables Required

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres

# Encryption (64 hex characters)
ENCRYPTION_KEY=your-encryption-key-here
```

---

## AI Provider Configuration

Users can configure multiple AI providers. Each provider:
1. Select provider from dropdown
2. Enter their API key (encrypted before storage)
3. Select model from fetched list
4. Optionally set as default

**Supported Providers:**
- DeepSeek (V3, Coder, R1)
- OpenAI (GPT-4o Mini, GPT-4o, o3-mini)
- Google Gemini (2.0 Flash, 1.5 Pro)
- OpenRouter (100+ models)
- Z.ai

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers` | List user's configured providers |
| POST | `/api/providers` | Add/update provider |
| DELETE | `/api/providers?id=` | Remove provider |
| POST | `/api/providers/models` | Fetch models for provider |
| GET | `/api/tokens` | List user's tokens |
| POST | `/api/tokens` | Create token (encrypted) |
| PATCH | `/api/tokens` | Update token |
| DELETE | `/api/tokens?id=` | Delete token |
| POST | `/api/tokens/[id]/decrypt` | Decrypt token value |
| POST | `/api/parse/ai` | Parse text using AI |
| GET | `/api/activities` | Get activity log |

---

## Production Checklist

Before deploying to Vercel:
- [ ] Generate ENCRYPTION_KEY (64 hex chars)
- [ ] Set up Supabase project with database
- [ ] Run `npx prisma db push` or migrate
- [ ] Add all env vars to Vercel
- [ ] Test all API endpoints
- [ ] Test provider configuration flow

---

_Last Updated: February 2026_