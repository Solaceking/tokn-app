import { Metadata } from "next";
import Link from "next/link";
import DocsLayout from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/docs/CodeBlock";
import "@/styles/docs/docs.css";

export const metadata: Metadata = {
  title: "Getting Started - TOKNS Documentation",
  description: "Learn how to deploy, configure, and start using TOKNS in minutes.",
};

export default function GettingStartedPage() {
  return (
    <DocsLayout activePage="getting-started">
      <main className="docs-content">
        <header className="docs-content-header">
          <h1 className="docs-content-title">Getting Started with TOKNS</h1>
          <p className="docs-content-subtitle">Learn how to deploy, configure, and start using TOKNS in minutes.</p>
        </header>

        <div className="docs-alert docs-alert-info">
          <strong>Quick Tip:</strong> You can deploy TOKNS to Vercel with one click using the button below.
        </div>

        <section>
          <h2 id="one-click-deploy">One-Click Deploy</h2>
          <p>The easiest way to get started is with our Vercel one-click deploy:</p>
          
          <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <a href="https://vercel.com/new/clone?repository-url=https://github.com/Solaceking/tokns-app" className="docs-btn docs-btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 15l5.19-2.82a1 1 0 0 0 0-1.36L10 9"/>
              </svg>
              Deploy to Vercel
            </a>
          </div>

          <p>After clicking the button:</p>
          <ol>
            <li>Log in to your Vercel account (or create one)</li>
            <li>Fork the repository when prompted</li>
            <li>Configure the required environment variables:</li>
          </ol>

          <CodeBlock language="bash" filename=".env">
{`# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your-32-character-hex-key

# Supabase (get from your Supabase project dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`}
          </CodeBlock>
        </section>

        <section>
          <h2 id="local-development">Local Development</h2>
          <p>To run TOKNS locally for development or self-hosting:</p>

          <h3 id="prerequisites">Prerequisites</h3>
          <ul>
            <li>Node.js 18 or higher</li>
            <li>npm or yarn package manager</li>
            <li>A free <a href="https://supabase.com">Supabase</a> account</li>
          </ul>

          <h3 id="setup-steps">Setup Steps</h3>
          <CodeBlock language="bash">
{`# 1. Clone the repository
git clone https://github.com/Solaceking/tokns-app.git
cd tokns-app

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env

# 4. Setup Supabase project
#    - Create a new project at https://supabase.com
#    - Get your project URL and anon key from Settings → API
#    - Run the SQL schema (see below)

# 5. Update .env with your credentials
#    - NEXT_PUBLIC_SUPABASE_URL
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY
#    - ENCRYPTION_KEY (generate with command above)

# 6. Generate Prisma client
npx prisma generate

# 7. Push database schema
npx prisma db push

# 8. Start development server
npm run dev`}
          </CodeBlock>
        </section>

        <section>
          <h2 id="database-schema">Database Schema</h2>
          <p>Run this SQL in your Supabase SQL Editor:</p>
          
          <CodeBlock language="sql" filename="schema.sql">
{`-- Create users table
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

-- RLS Policies
CREATE POLICY "Users can view own data" ON "users" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON "users" FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own data" ON "users" FOR UPDATE USING (auth.uid() = id);`}
          </CodeBlock>
        </section>

        <section>
          <h2 id="first-time-setup">First Time Setup</h2>
          <p>Once your deployment is running:</p>
          
          <div className="docs-alert docs-alert-success">
            <strong>Welcome Tutorial:</strong> When you first log in, TOKNS will guide you through adding your first token and exploring features.
          </div>

          <h3 id="adding-first-token">Adding Your First Token</h3>
          <ol>
            <li>Navigate to your deployed TOKNS instance</li>
            <li>Sign up with your email</li>
            <li>Click &quot;Add Token&quot; on the dashboard</li>
            <li>Paste an API key or token</li>
            <li>The AI parser will auto-detect the service type</li>
            <li>Add a description and category</li>
            <li>Save your token</li>
          </ol>

          <p>Congratulations! You&apos;ve successfully set up TOKNS.</p>
        </section>

        <section>
          <h2 id="next-steps">Next Steps</h2>
          <ul>
            <li><Link href="/docs/guides">Explore user guides</Link> for advanced features</li>
            <li><Link href="/docs/security">Review security best practices</Link></li>
            <li><Link href="/docs/api">Check the API reference</Link> for integrations</li>
            <li><Link href="/docs/contributing">Learn how to contribute</Link> to the project</li>
          </ul>
        </section>

        <section className="docs-cta">
          <div className="docs-cta-container">
            <h2 className="docs-cta-title">Need Help?</h2>
            <p className="docs-cta-description">
              Join our community or open an issue on GitHub for support.
            </p>
            <div className="docs-cta-actions">
              <a href="https://github.com/Solaceking/tokns-app/issues" className="docs-btn docs-btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Open Issue
              </a>
              <a href="https://github.com/Solaceking/tokns-app/discussions" className="docs-btn docs-btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Join Discussion
              </a>
            </div>
          </div>
        </section>
      </main>
    </DocsLayout>
  );
}
