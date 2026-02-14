# TOKNS - Open Source Token Manager

<p align="center">
  <img src="public/logo.svg" alt="TOKNS" width="128" height="128">
</p>

<p align="center">
  A secure, open-source token/API key manager for developers.
</p>

<p align="center">
  <a href="https://vercel.com/deploy/button">
    <img src="https://vercel.com/button" alt="Deploy to Vercel">
  </a>
</p>

---

## ✨ Features

- 🔐 **Secure Encryption** - AES-256-GCM encryption for all tokens
- 🤖 **AI-Powered Parser** - Automatically detect tokens from text/code
- 🎨 **Beautiful UI** - Dark/Light theme with modern design
- 📦 **Export Ready** - Export to `.env` format
- 🔍 **Token Testing** - Verify if tokens are still valid
- 📊 **Activity Tracking** - Log all token operations

---

## 🚀 Quick Deploy

### One-Click to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Solaceking/tokns-app)

1. Click the button above
2. Fork this repository
3. Add these environment variables:

```env
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your-32-character-hex-key

# Supabase (get from your Supabase project dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Deploy! 🎉

---

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free)

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Solaceking/tokns-app.git
cd tokns-app

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Setup Supabase
# - Create a new Supabase project
# - Run the SQL below in Supabase SQL Editor

# 5. Update .env with your Supabase credentials
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - ENCRYPTION_KEY (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# 6. Generate Prisma client
npx prisma generate

# 7. Push database schema
npx prisma db push

# 8. Start development server
npm run dev
```

### Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "username" TEXT,
    "full_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create tokens table
CREATE TABLE IF NOT EXISTS "Token" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "service" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Other',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create activities table
CREATE TABLE IF NOT EXISTS "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "action" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "details" TEXT,
    "userId" TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create user_ai_providers table
CREATE TABLE IF NOT EXISTS "UserAIProvider" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
    "provider" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "baseUrl" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "selectedModel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "provider")
);

-- Enable Row Level Security
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Token" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Activity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAIProvider" ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own data" ON "users" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON "users" FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own data" ON "users" FOR UPDATE USING (auth.uid() = id);

-- Note: Token/Activity policies need to reference the users table via email
-- For simplicity, we'll handle this at API level with Supabase Auth
```

---

## 📖 Usage

### Adding Tokens

1. Go to Dashboard
2. Click "Add Token"
3. Paste your API key/token
4. The AI will auto-detect the service type
5. Save!

### Testing Tokens

Click "Test Token" on any token to verify it's still valid. Supports:
- OpenAI / GPT
- GitHub
- Stripe
- Google Cloud
- SendGrid
- Twilio

### Exporting

Click the download icon to export all tokens as a `.env` file.

---

## 🔐 Security

- All tokens are encrypted with AES-256-GCM before storage
- Encryption key is stored in server environment variables
- Supabase handles authentication
- No tokens are ever stored in plain text

---

## 🛡️ License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🙏 Support

Like this project? Consider supporting:

- ⭐ Star on GitHub
- ☕ Buy me a coffee
- 🐛 Report bugs

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS.
