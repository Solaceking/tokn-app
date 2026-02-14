import { Metadata } from "next";
import Link from "next/link";
import DocsLayout from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/docs/CodeBlock";
import "@/styles/docs/docs.css";

export const metadata: Metadata = {
  title: "User Guides - TOKNS Documentation",
  description: "Learn how to use all features of TOKNS effectively.",
};

export default function GuidesPage() {
  return (
    <DocsLayout activePage="guides">
      <main className="docs-content">
        <header className="docs-content-header">
          <h1 className="docs-content-title">TOKNS User Guides</h1>
          <p className="docs-content-subtitle">Learn how to use all features of TOKNS effectively.</p>
        </header>

        <div className="docs-alert docs-alert-info">
          <strong>Pro Tip:</strong> TOKNS offers both free (15 tokens) and Pro ($7.99/user/month) tiers. Upgrade for unlimited tokens and team collaboration.
        </div>

        <section>
          <h2 id="token-management">Token Management</h2>
          
          <h3 id="adding-tokens">Adding Tokens</h3>
          <p>There are several ways to add tokens to TOKNS:</p>
          
          <div className="docs-alert docs-alert-success">
            <strong>AI-Powered Parser:</strong> TOKNS can automatically detect service types from pasted text or code snippets.
          </div>

          <h4>Manual Token Entry</h4>
          <ol>
            <li>Click &quot;Add Token&quot; on the dashboard</li>
            <li>Select &quot;Manual Entry&quot;</li>
            <li>Choose service type (OpenAI, GitHub, Stripe, etc.)</li>
            <li>Paste your token or API key</li>
            <li>Add optional description and category</li>
            <li>Click &quot;Save Token&quot;</li>
          </ol>

          <h4>AI-Powered Parser</h4>
          <ol>
            <li>Navigate to <strong>Parser</strong> in the sidebar</li>
            <li>Paste any text containing API keys or tokens</li>
            <li>TOKNS will automatically detect all tokens</li>
            <li>Review detected tokens and confirm</li>
            <li>Tokens are automatically categorized and saved</li>
          </ol>

          <h4>Bulk Import</h4>
          <p>Import tokens from .env files or JSON:</p>
          <CodeBlock language="bash" filename=".env">
{`# .env format example
OPENAI_API_KEY=sk-abc123
GITHUB_TOKEN=ghp_xyz789
STRIPE_SECRET_KEY=sk_live_456def`}
          </CodeBlock>

          <p>TOKNS can parse and import these formats automatically.</p>
        </section>

        <section>
          <h2 id="token-testing">Token Testing</h2>
          <p>TOKNS can verify if your tokens are still valid:</p>
          
          <h3 id="supported-services">Supported Services</h3>
          <ul>
            <li><strong>OpenAI / GPT:</strong> Tests API connectivity and quota</li>
            <li><strong>GitHub:</strong> Validates token permissions</li>
            <li><strong>Stripe:</strong> Checks API key validity</li>
            <li><strong>Google Cloud:</strong> Verifies service account keys</li>
            <li><strong>SendGrid:</strong> Tests email API access</li>
            <li><strong>Twilio:</strong> Validates SMS/voice API keys</li>
            <li><strong>Custom endpoints:</strong> Test any REST API</li>
          </ul>

          <h3 id="testing-tokens">How to Test Tokens</h3>
          <ol>
            <li>Navigate to your token list</li>
            <li>Click &quot;Test Token&quot; on any token</li>
            <li>TOKNS will make a test request to the service</li>
            <li>View results in the activity log</li>
          </ol>

          <div className="docs-alert docs-alert-warning">
            <strong>Note:</strong> Testing tokens sends actual API requests. Some services may charge for these requests.
          </div>
        </section>

        <section>
          <h2 id="categories-tags">Categories &amp; Tags</h2>
          <p>Organize your tokens with categories and tags:</p>

          <h3 id="default-categories">Default Categories</h3>
          <ul>
            <li><strong>AI/ML:</strong> OpenAI, Anthropic, Google AI</li>
            <li><strong>Development:</strong> GitHub, GitLab, Docker</li>
            <li><strong>Payment:</strong> Stripe, PayPal, Square</li>
            <li><strong>Cloud:</strong> AWS, Google Cloud, Azure</li>
            <li><strong>Communication:</strong> Twilio, SendGrid, Slack</li>
            <li><strong>Database:</strong> MongoDB, PostgreSQL, Redis</li>
            <li><strong>Other:</strong> Custom or uncategorized</li>
          </ul>

          <h3 id="creating-custom-categories">Creating Custom Categories</h3>
          <ol>
            <li>Go to Settings → Categories</li>
            <li>Click &quot;Add Category&quot;</li>
            <li>Enter category name and color</li>
            <li>Save to apply to all tokens</li>
          </ol>
        </section>

        <section>
          <h2 id="export-import">Export &amp; Import</h2>
          
          <h3 id="exporting-tokens">Exporting Tokens</h3>
          <p>Export your tokens for backup or migration:</p>
          <ol>
            <li>Go to Dashboard</li>
            <li>Click the download icon</li>
            <li>Choose export format:
              <ul>
                <li><strong>.env:</strong> Standard environment variables</li>
                <li><strong>JSON:</strong> Full token data with metadata</li>
                <li><strong>CSV:</strong> Spreadsheet format</li>
              </ul>
            </li>
            <li>Download and save securely</li>
          </ol>

          <h3 id="importing-tokens">Importing Tokens</h3>
          <p>Import tokens from other systems:</p>
          <ol>
            <li>Go to Settings → Import</li>
            <li>Select file format</li>
            <li>Upload your file</li>
            <li>Review imported tokens</li>
            <li>Confirm import</li>
          </ol>

          <div className="docs-alert docs-alert-info">
            <strong>Security:</strong> Imported tokens are encrypted immediately using your ENCRYPTION_KEY.
          </div>
        </section>

        <section>
          <h2 id="team-collaboration">Team Collaboration (Pro Feature)</h2>
          <p>Pro users can collaborate with team members:</p>

          <h3 id="inviting-members">Inviting Team Members</h3>
          <ol>
            <li>Go to Settings → Team</li>
            <li>Click &quot;Invite Member&quot;</li>
            <li>Enter email address</li>
            <li>Select role (Admin, Editor, Viewer)</li>
            <li>Send invitation</li>
          </ol>

          <h3 id="team-roles">Team Roles</h3>
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Permissions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Admin</strong></td>
                <td>Full access: add/remove tokens, manage team, billing</td>
              </tr>
              <tr>
                <td><strong>Editor</strong></td>
                <td>Add/edit tokens, view all tokens, export</td>
              </tr>
              <tr>
                <td><strong>Viewer</strong></td>
                <td>View tokens only (read-only)</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 id="activity-tracking">Activity Tracking</h2>
          <p>TOKNS logs all token operations for security and audit:</p>

          <h3 id="tracked-actions">Tracked Actions</h3>
          <ul>
            <li><strong>Token Created:</strong> When a new token is added</li>
            <li><strong>Token Updated:</strong> When token details change</li>
            <li><strong>Token Deleted:</strong> When a token is removed</li>
            <li><strong>Token Tested:</strong> When a token is tested</li>
            <li><strong>Token Exported:</strong> When tokens are exported</li>
            <li><strong>Login Events:</strong> User authentication</li>
          </ul>

          <h3 id="viewing-activity">Viewing Activity Logs</h3>
          <ol>
            <li>Go to Dashboard → Activity</li>
            <li>Filter by date, action, or service</li>
            <li>Export logs for compliance</li>
          </ol>
        </section>

        <section>
          <h2 id="best-practices">Best Practices</h2>
          
          <div className="docs-alert docs-alert-success">
            <strong>Recommendations:</strong>
          </div>

          <h3 id="token-security">Token Security</h3>
          <ul>
            <li>Rotate tokens regularly (every 90 days)</li>
            <li>Use least-privilege permissions</li>
            <li>Never share tokens in plain text</li>
            <li>Use TOKNS&apos;s encryption for all storage</li>
          </ul>

          <h3 id="organization">Organization</h3>
          <ul>
            <li>Use descriptive names and categories</li>
            <li>Add expiration dates to tokens when possible</li>
            <li>Regularly test token validity</li>
            <li>Archive unused tokens instead of deleting</li>
          </ul>

          <h3 id="backup">Backup Strategy</h3>
          <ul>
            <li>Export tokens monthly for backup</li>
            <li>Store backups in encrypted storage</li>
            <li>Test restore process periodically</li>
            <li>Keep multiple backup versions</li>
          </ul>
        </section>

        <section className="docs-cta">
          <div className="docs-cta-container">
            <h2 className="docs-cta-title">Ready to explore more?</h2>
            <p className="docs-cta-description">
              Check out our API reference for integrations and automation.
            </p>
            <div className="docs-cta-actions">
              <Link href="/docs/api" className="docs-btn docs-btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                  <line x1="6" y1="6" x2="6" y2="6"/>
                  <line x1="6" y1="18" x2="6" y2="18"/>
                </svg>
                API Reference
              </Link>
              <Link href="/docs/security" className="docs-btn docs-btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Security Guide
              </Link>
            </div>
          </div>
        </section>
      </main>
    </DocsLayout>
  );
}
