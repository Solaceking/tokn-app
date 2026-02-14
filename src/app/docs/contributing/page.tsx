import { Metadata } from "next";
import DocsLayout from "@/components/docs/DocsLayout";
import "@/styles/docs/docs.css";

export const metadata: Metadata = {
  title: "Contributing - TOKNS Documentation",
  description: "Help make TOKNS better for everyone. Learn how to contribute code, documentation, and ideas.",
};

export default function ContributingPage() {
  return (
    <DocsLayout activePage="contributing">
      <main className="docs-content">
        <div className="docs-container docs-content-container">
          <header className="docs-content-header">
            <h1 className="docs-content-title">Contributing to TOKNS</h1>
            <p className="docs-content-subtitle">Help make TOKNS better for everyone. Learn how to contribute code, documentation, and ideas.</p>
          </header>

          <div className="docs-alert docs-alert-info">
            <strong>Open Source:</strong> TOKNS is MIT licensed. We welcome contributions from developers of all skill levels.
          </div>

          <section>
            <h2 id="getting-started">Getting Started</h2>
            
            <h3 id="prerequisites">Prerequisites</h3>
            <ul>
              <li>Node.js 18+ and npm/yarn</li>
              <li>Git for version control</li>
              <li>A GitHub account</li>
              <li>Basic understanding of Next.js, React, and TypeScript</li>
            </ul>

            <h3 id="fork-and-clone">Fork and Clone</h3>
            <ol>
              <li>Fork the repository on GitHub</li>
              <li>Clone your fork locally:</li>
            </ol>
            <pre><code>{`git clone https://github.com/YOUR_USERNAME/tokns-app.git
cd tokns-app`}</code></pre>

            <h3 id="setup-development">Setup Development Environment</h3>
            <pre><code>{`# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Setup Supabase (see Getting Started guide)
# Update .env with your credentials

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev`}</code></pre>
          </section>

          <section>
            <h2 id="development-workflow">Development Workflow</h2>
            
            <h3 id="branch-naming">Branch Naming</h3>
            <p>Use descriptive branch names:</p>
            <pre><code>{`# Feature
feature/add-dark-mode

# Bug fix
fix/token-parser-issue

# Documentation
docs/update-api-reference

# Enhancement
enhance/improve-ui-performance`}</code></pre>

            <h3 id="commit-messages">Commit Messages</h3>
            <p>Follow conventional commits:</p>
            <pre><code>{`feat: add token rotation feature
fix: resolve token parsing bug
docs: update installation guide
style: format code with prettier
refactor: improve encryption logic
test: add unit tests for parser
chore: update dependencies`}</code></pre>
          </section>

          <section>
            <h2 id="code-standards">Code Standards</h2>
            
            <h3 id="typescript">TypeScript</h3>
            <ul>
              <li>Use strict TypeScript configuration</li>
              <li>Define interfaces for all data structures</li>
              <li>Avoid <code>any</code> type when possible</li>
              <li>Use type guards for runtime type checking</li>
            </ul>

            <h3 id="react">React/Next.js</h3>
            <ul>
              <li>Use functional components with hooks</li>
              <li>Follow Next.js App Router conventions</li>
              <li>Implement proper error boundaries</li>
              <li>Use server components when appropriate</li>
            </ul>

            <h3 id="styling">Styling</h3>
            <ul>
              <li>Use Tailwind CSS utility classes</li>
              <li>Follow shadcn/ui component patterns</li>
              <li>Maintain consistent spacing and colors</li>
              <li>Support dark/light theme variants</li>
            </ul>
          </section>

          <section>
            <h2 id="testing">Testing</h2>
            
            <h3 id="test-types">Test Types</h3>
            <ul>
              <li><strong>Unit Tests:</strong> Test individual functions/components</li>
              <li><strong>Integration Tests:</strong> Test API endpoints and workflows</li>
              <li><strong>E2E Tests:</strong> Test complete user flows</li>
            </ul>

            <h3 id="running-tests">Running Tests</h3>
            <pre><code>{`# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- src/lib/encryption.test.ts

# Run with coverage
npm run test:coverage`}</code></pre>
          </section>

          <section>
            <h2 id="pull-requests">Pull Requests</h2>
            
            <h3 id="pr-checklist">Pull Request Checklist</h3>
            <ul>
              <li>Tests pass</li>
              <li>Code follows project standards</li>
              <li>Documentation updated</li>
              <li>No console.log/debug statements</li>
              <li>Commit messages follow conventions</li>
              <li>Branch is up-to-date with main</li>
            </ul>

            <h3 id="pr-description">PR Description Template</h3>
            <pre><code>{`## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactor

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if UI changes)`}</code></pre>
          </section>

          <section>
            <h2 id="areas-to-contribute">Areas to Contribute</h2>
            
            <h3 id="good-first-issues">Good First Issues</h3>
            <ul>
              <li>Documentation improvements</li>
              <li>UI/UX enhancements</li>
              <li>Test coverage improvements</li>
              <li>Bug fixes with clear reproduction steps</li>
              <li>Performance optimizations</li>
            </ul>

            <h3 id="feature-development">Feature Development</h3>
            <ul>
              <li>New token service integrations</li>
              <li>Advanced token testing capabilities</li>
              <li>Team collaboration features</li>
              <li>API enhancements</li>
              <li>CLI tool development</li>
            </ul>

            <h3 id="documentation">Documentation</h3>
            <ul>
              <li>Tutorials and guides</li>
              <li>API documentation</li>
              <li>Translation to other languages</li>
              <li>Video tutorials/screencasts</li>
            </ul>
          </section>

          <section>
            <h2 id="community">Community Guidelines</h2>
            
            <h3 id="code-of-conduct">Code of Conduct</h3>
            <p>TOKNS follows the Contributor Covenant Code of Conduct:</p>
            <ul>
              <li>Be respectful and inclusive</li>
              <li>Provide constructive feedback</li>
              <li>Focus on what&apos;s best for the community</li>
              <li>Show empathy towards other contributors</li>
            </ul>

            <h3 id="communication">Communication</h3>
            <ul>
              <li>Use GitHub Issues for bug reports</li>
              <li>Use GitHub Discussions for questions/ideas</li>
              <li>Be responsive to code reviews</li>
              <li>Ask for help when needed</li>
            </ul>
          </section>

          <section>
            <h2 id="monetization">Monetization &amp; Sponsorship</h2>
            
            <h3 id="open-source-model">Open Source Model</h3>
            <p>TOKNS is free and open source. We support development through:</p>
            <ul>
              <li><strong>GitHub Sponsors:</strong> Monthly financial support</li>
              <li><strong>Pro Subscriptions:</strong> Hosted service revenue</li>
              <li><strong>Consulting:</strong> Custom deployments and support</li>
            </ul>

            <h3 id="sponsor-benefits">Sponsor Benefits</h3>
            <ul>
              <li>Priority issue triage</li>
              <li>Feature request prioritization</li>
              <li>Recognition in README and documentation</li>
              <li>Direct access to core team</li>
            </ul>
          </section>

          <section className="docs-cta" style={{ marginTop: "3rem", borderRadius: "0.5rem" }}>
            <div className="docs-cta-container">
              <h2 className="docs-cta-title">Ready to Contribute?</h2>
              <p className="docs-cta-description">
                Start by exploring issues or joining our discussions.
              </p>
              <div className="docs-cta-actions">
                <a href="https://github.com/Solaceking/tokns-app/issues" className="docs-btn docs-btn-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View Issues
                </a>
                <a href="https://github.com/Solaceking/tokns-app/discussions" className="docs-btn docs-btn-secondary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Join Discussions
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </DocsLayout>
  );
}
