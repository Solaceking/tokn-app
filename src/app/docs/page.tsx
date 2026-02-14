import { Metadata } from "next";
import Link from "next/link";
import DocsLayout from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/docs/CodeBlock";
import "@/styles/docs/docs.css";

export const metadata: Metadata = {
  title: "TOKNS Documentation - Secure Token Manager for Developers",
  description: "Comprehensive documentation for TOKNS - Secure, open-source token/API key manager for developers. Learn how to deploy, use, and contribute to TOKNS.",
};

export default function DocsHomePage() {
  return (
    <DocsLayout>
      <section className="docs-hero">
        <div className="docs-container docs-hero-container">
          <div className="docs-hero-content">
            <h1 className="docs-hero-title">TOKNS Documentation</h1>
            <p className="docs-hero-subtitle">
              Secure, open-source token/API key manager for developers. 
              Learn how to deploy, use, and contribute to TOKNS.
            </p>
            <div className="docs-hero-actions">
              <Link href="/docs/getting-started" className="docs-btn docs-btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                Get Started
              </Link>
              <a href="https://github.com/Solaceking/tokns-app" className="docs-btn docs-btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Star on GitHub
              </a>
            </div>
          </div>
          <div className="docs-hero-visual">
            <div className="docs-terminal">
              <div className="docs-terminal-header">
                <div className="docs-terminal-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="docs-terminal-title">bash</div>
              </div>
              <div className="docs-terminal-content">
                <div className="docs-terminal-line">
                  <span className="prompt">$</span>
                  <span className="command">npx create-tokns-app@latest</span>
                </div>
                <div className="docs-terminal-line">
                  <span className="output">🚀 Creating TOKNS project...</span>
                </div>
                <div className="docs-terminal-line">
                  <span className="output">✅ Project ready!</span>
                </div>
                <div className="docs-terminal-line">
                  <span className="prompt">$</span>
                  <span className="command">cd tokns-app && npm run dev</span>
                </div>
                <div className="docs-terminal-line">
                  <span className="output">🌐 Server running on http://localhost:3000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="docs-features">
        <div className="docs-container">
          <h2 className="docs-section-title">Everything you need to know</h2>
          <p className="docs-section-subtitle">Comprehensive guides and documentation for every aspect of TOKNS</p>
          
          <div className="docs-features-grid">
            <Link href="/docs/getting-started" className="docs-feature-card">
              <div className="docs-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3 className="docs-feature-title">Getting Started</h3>
              <p className="docs-feature-description">Quick start guide, deployment, and first token setup</p>
            </Link>
            
            <Link href="/docs/guides" className="docs-feature-card">
              <div className="docs-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <h3 className="docs-feature-title">User Guides</h3>
              <p className="docs-feature-description">Token management, team collaboration, parsing, and more</p>
            </Link>
            
            <Link href="/docs/api" className="docs-feature-card">
              <div className="docs-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                  <line x1="6" y1="6" x2="6" y2="6"/>
                  <line x1="6" y1="18" x2="6" y2="18"/>
                </svg>
              </div>
              <h3 className="docs-feature-title">API Reference</h3>
              <p className="docs-feature-description">Complete API documentation with examples</p>
            </Link>
            
            <Link href="/docs/security" className="docs-feature-card">
              <div className="docs-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3 className="docs-feature-title">Security</h3>
              <p className="docs-feature-description">Encryption, privacy, compliance, and best practices</p>
            </Link>
            
            <Link href="/docs/contributing" className="docs-feature-card">
              <div className="docs-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3 className="docs-feature-title">Contributing</h3>
              <p className="docs-feature-description">How to contribute to the open-source project</p>
            </Link>
            
            <Link href="/docs/changelog" className="docs-feature-card">
              <div className="docs-feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3 className="docs-feature-title">Changelog</h3>
              <p className="docs-feature-description">Version history, release notes, and migration guides</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="docs-quickstart">
        <div className="docs-container">
          <h2 className="docs-section-title">Quick Start</h2>
          <p className="docs-section-subtitle">Get up and running in minutes</p>
          
          <CodeBlock language="bash" filename="Terminal">
{`# Clone the repository
git clone https://github.com/Solaceking/tokns-app.git
cd tokns-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev`}
          </CodeBlock>
          
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link href="/docs/getting-started" className="docs-btn docs-btn-primary">
              View Full Installation Guide
            </Link>
          </div>
        </div>
      </section>

      <section className="docs-cta">
        <div className="docs-container docs-cta-container">
          <h2 className="docs-cta-title">Ready to secure your tokens?</h2>
          <p className="docs-cta-description">
            Deploy TOKNS in minutes and start managing your API tokens securely.
          </p>
          <div className="docs-cta-actions">
            <Link href="/docs/getting-started" className="docs-btn docs-btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 15l5.19-2.82a1 1 0 0 0 0-1.36L10 9"/>
              </svg>
              Start Learning
            </Link>
            <a href="https://vercel.com/new/clone?repository-url=https://github.com/Solaceking/tokns-app" className="docs-btn docs-btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Deploy Now
            </a>
          </div>
        </div>
      </section>
    </DocsLayout>
  );
}
