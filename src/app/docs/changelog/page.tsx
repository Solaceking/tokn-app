import { Metadata } from "next";
import DocsLayout from "@/components/docs/DocsLayout";
import "@/styles/docs/docs.css";

export const metadata: Metadata = {
  title: "Changelog - TOKNS Documentation",
  description: "Version history, release notes, and migration guides.",
};

export default function ChangelogPage() {
  return (
    <DocsLayout activePage="changelog">
      <main className="docs-content">
        <div className="docs-container docs-content-container">
          <header className="docs-content-header">
            <h1 className="docs-content-title">TOKNS Changelog</h1>
            <p className="docs-content-subtitle">Version history, release notes, and migration guides.</p>
          </header>

          <div className="docs-alert docs-alert-info">
            <strong>Note:</strong> This changelog is maintained on GitHub. For the latest updates, check our <a href="https://github.com/Solaceking/tokns-app/releases">GitHub Releases</a> page.
          </div>

          <section>
            <h2 id="v1-0-0">v1.0.0 - Initial Release</h2>
            <p className="docs-release-date">February 2024</p>
            
            <h3 id="new-features">New Features</h3>
            <ul>
              <li>Secure token storage with AES-256-GCM encryption</li>
              <li>AI-powered token parser</li>
              <li>Token testing for multiple services</li>
              <li>Dark/Light theme support</li>
              <li>Activity logging and audit trails</li>
              <li>Export to .env format</li>
              <li>One-click Vercel deployment</li>
            </ul>

            <h3 id="improvements">Improvements</h3>
            <ul>
              <li>Enhanced UI/UX with shadcn/ui components</li>
              <li>Improved token detection accuracy</li>
              <li>Better error handling and user feedback</li>
              <li>Performance optimizations</li>
            </ul>

            <h3 id="breaking-changes">Breaking Changes</h3>
            <p>None - This is the initial public release.</p>
          </section>

          <section>
            <h2 id="v0-9-0">v0.9.0 - Beta Release</h2>
            <p className="docs-release-date">January 2024</p>
            
            <h3 id="beta-features">Beta Features</h3>
            <ul>
              <li>Basic token CRUD operations</li>
              <li>Supabase authentication</li>
              <li>Simple token encryption</li>
              <li>Basic dashboard UI</li>
            </ul>
          </section>

          <section>
            <h2 id="roadmap">Upcoming Roadmap</h2>
            
            <h3 id="v1-1-0">v1.1.0 - Team Collaboration</h3>
            <ul>
              <li>Team member invitations</li>
              <li>Role-based access control</li>
              <li>Shared token management</li>
              <li>Team activity dashboard</li>
            </ul>

            <h3 id="v1-2-0">v1.2.0 - Advanced Features</h3>
            <ul>
              <li>Token auto-rotation</li>
              <li>Usage analytics</li>
              <li>Webhook integrations</li>
              <li>CLI tool</li>
            </ul>

            <h3 id="v2-0-0">v2.0.0 - Enterprise</h3>
            <ul>
              <li>SSO/SAML integration</li>
              <li>Custom branding</li>
              <li>Audit log exports</li>
              <li>Advanced compliance features</li>
            </ul>
          </section>

          <section>
            <h2 id="migration-guides">Migration Guides</h2>
            
            <h3 id="upgrading">Upgrading TOKNS</h3>
            <p>Follow these steps to upgrade your TOKNS instance:</p>
            <ol>
              <li>Backup your database</li>
              <li>Pull latest changes from GitHub</li>
              <li>Update dependencies: <code>npm install</code></li>
              <li>Run database migrations: <code>npx prisma db push</code></li>
              <li>Restart your server</li>
            </ol>

            <div className="docs-alert docs-alert-warning">
              <strong>Important:</strong> Always test upgrades in a staging environment before deploying to production.
            </div>
          </section>

          <section>
            <h2 id="support">Support &amp; Compatibility</h2>
            
            <h3 id="browser-support">Browser Support</h3>
            <ul>
              <li>Chrome 90+</li>
              <li>Firefox 88+</li>
              <li>Safari 14+</li>
              <li>Edge 90+</li>
            </ul>

            <h3 id="node-js">Node.js Support</h3>
            <ul>
              <li>Node.js 18+</li>
              <li>npm 8+ or yarn 1.22+</li>
            </ul>
          </section>

          <section className="docs-cta" style={{ marginTop: "3rem", borderRadius: "0.5rem" }}>
            <div className="docs-cta-container">
              <h2 className="docs-cta-title">Stay Updated</h2>
              <p className="docs-cta-description">
                Subscribe to releases or watch the repository for updates.
              </p>
              <div className="docs-cta-actions">
                <a href="https://github.com/Solaceking/tokns-app/releases" className="docs-btn docs-btn-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Releases
                </a>
                <a href="https://github.com/Solaceking/tokns-app/subscription" className="docs-btn docs-btn-secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  Subscribe
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </DocsLayout>
  );
}
