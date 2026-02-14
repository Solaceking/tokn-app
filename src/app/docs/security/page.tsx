import { Metadata } from "next";
import DocsLayout from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/docs/CodeBlock";
import "@/styles/docs/docs.css";

export const metadata: Metadata = {
  title: "Security - TOKNS Documentation",
  description: "Learn about our security architecture, best practices, and compliance.",
};

export default function SecurityPage() {
  return (
    <DocsLayout activePage="security">
      <main className="docs-content">
        <header className="docs-content-header">
          <h1 className="docs-content-title">TOKNS Security</h1>
          <p className="docs-content-subtitle">Learn about our security architecture, best practices, and compliance.</p>
        </header>

        <div className="docs-alert docs-alert-success">
          <strong>Security First:</strong> TOKNS is built with security as the top priority. All tokens are encrypted at rest and in transit.
        </div>

        <section>
          <h2 id="encryption">Encryption</h2>
          
          <h3 id="aes-256-gcm">AES-256-GCM Encryption</h3>
          <p>TOKNS uses AES-256-GCM (Galois/Counter Mode) encryption for all tokens:</p>
          <ul>
            <li><strong>Algorithm:</strong> AES-256-GCM</li>
            <li><strong>Key Size:</strong> 256-bit (32 bytes)</li>
            <li><strong>Mode:</strong> GCM (authenticated encryption)</li>
            <li><strong>IV:</strong> Random 12-byte initialization vector per encryption</li>
            <li><strong>Authentication:</strong> Built-in GCM authentication tags</li>
          </ul>

          <h3 id="encryption-flow">Encryption Flow</h3>
          <ol>
            <li><strong>Client-side:</strong> Tokens are encrypted before transmission</li>
            <li><strong>Server-side:</strong> Encrypted tokens are stored in database</li>
            <li><strong>Decryption:</strong> Tokens are only decrypted when needed (with rate limits)</li>
            <li><strong>Re-encryption:</strong> Decrypted tokens are re-encrypted after 5 minutes</li>
          </ol>

          <div className="docs-alert docs-alert-info">
            <strong>Note:</strong> The ENCRYPTION_KEY is never stored in the database. It must be provided as an environment variable.
          </div>
        </section>

        <section>
          <h2 id="key-management">Key Management</h2>
          
          <h3 id="encryption-key">Encryption Key Generation</h3>
          <p>Generate a secure encryption key:</p>
          <CodeBlock language="bash" filename="Terminal">
{`# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Bash (with openssl)
openssl rand -hex 32

# Python
python -c "import secrets; print(secrets.token_hex(32))"`}
          </CodeBlock>

          <h3 id="key-rotation">Key Rotation</h3>
          <p>TOKNS supports encryption key rotation:</p>
          <ol>
            <li>Generate a new ENCRYPTION_KEY</li>
            <li>Add both old and new keys to environment (comma-separated)</li>
            <li>TOKNS will automatically re-encrypt tokens with new key</li>
            <li>Remove old key after all tokens are migrated</li>
          </ol>

          <CodeBlock language="bash" filename=".env">
{`# Environment variable format for rotation
ENCRYPTION_KEY=new_key_hex,old_key_hex`}
          </CodeBlock>
        </section>

        <section>
          <h2 id="data-protection">Data Protection</h2>
          
          <h3 id="data-at-rest">Data at Rest</h3>
          <ul>
            <li>All tokens encrypted with AES-256-GCM</li>
            <li>Encryption keys stored separately (environment variables)</li>
            <li>Database backups are also encrypted</li>
            <li>Regular security audits of stored data</li>
          </ul>

          <h3 id="data-in-transit">Data in Transit</h3>
          <ul>
            <li>HTTPS/TLS 1.3 for all communications</li>
            <li>HSTS (HTTP Strict Transport Security) headers</li>
            <li>Secure cookies with HttpOnly and Secure flags</li>
            <li>CSP (Content Security Policy) headers</li>
          </ul>

          <h3 id="data-isolation">Data Isolation</h3>
          <ul>
            <li>Row-level security in database (Supabase RLS)</li>
            <li>Users can only access their own tokens</li>
            <li>Team members see only shared tokens</li>
            <li>Activity logs for all access attempts</li>
          </ul>
        </section>

        <section>
          <h2 id="authentication-security">Authentication &amp; Authorization</h2>
          
          <h3 id="supabase-auth">Supabase Authentication</h3>
          <p>TOKNS uses Supabase Auth for secure authentication:</p>
          <ul>
            <li><strong>JWT tokens:</strong> Short-lived access tokens</li>
            <li><strong>Refresh tokens:</strong> Secure refresh mechanism</li>
            <li><strong>Password hashing:</strong> bcrypt with salt</li>
            <li><strong>Rate limiting:</strong> Login attempt limits</li>
          </ul>

          <h3 id="api-security">API Security</h3>
          <ul>
            <li>API keys with configurable permissions</li>
            <li>Rate limiting per API key</li>
            <li>IP whitelisting (Pro feature)</li>
            <li>Automatic key rotation recommendations</li>
          </ul>

          <h3 id="session-management">Session Management</h3>
          <ul>
            <li>Short session timeout (default: 24 hours)</li>
            <li>Automatic session invalidation on password change</li>
            <li>Device tracking and session revocation</li>
            <li>Login notifications for new devices</li>
          </ul>
        </section>

        <section>
          <h2 id="compliance">Compliance &amp; Standards</h2>
          
          <h3 id="gdpr">GDPR Compliance</h3>
          <ul>
            <li>Data minimization principles</li>
            <li>Right to erasure (token deletion)</li>
            <li>Data portability (export functionality)</li>
            <li>Privacy by design architecture</li>
          </ul>

          <h3 id="soc2">SOC 2 Readiness</h3>
          <p>TOKNS is designed with SOC 2 principles:</p>
          <ul>
            <li><strong>Security:</strong> Encryption, access controls, monitoring</li>
            <li><strong>Availability:</strong> High availability architecture</li>
            <li><strong>Processing Integrity:</strong> Data validation, error handling</li>
            <li><strong>Confidentiality:</strong> Data encryption, access logs</li>
            <li><strong>Privacy:</strong> Data minimization, user consent</li>
          </ul>
        </section>

        <section>
          <h2 id="best-practices">Security Best Practices</h2>
          
          <h3 id="deployment-security">Deployment Security</h3>
          <ol>
            <li><strong>Use HTTPS:</strong> Always deploy with TLS/SSL</li>
            <li><strong>Environment Variables:</strong> Store keys in secure env vars</li>
            <li><strong>Regular Updates:</strong> Keep dependencies updated</li>
            <li><strong>Security Headers:</strong> Configure CSP, HSTS, etc.</li>
            <li><strong>Database Security:</strong> Use strong passwords, enable RLS</li>
          </ol>

          <h3 id="token-security">Token Security Recommendations</h3>
          <ul>
            <li>Rotate tokens every 90 days</li>
            <li>Use least-privilege permissions</li>
            <li>Monitor token usage patterns</li>
            <li>Set expiration dates when possible</li>
            <li>Regularly audit token permissions</li>
          </ul>

          <h3 id="user-education">User Education</h3>
          <ul>
            <li>Enable two-factor authentication (when available)</li>
            <li>Use strong, unique passwords</li>
            <li>Review activity logs regularly</li>
            <li>Report suspicious activity immediately</li>
          </ul>
        </section>

        <section>
          <h2 id="reporting">Security Reporting</h2>
          
          <h3 id="vulnerability-reporting">Vulnerability Disclosure</h3>
          <p>We welcome responsible disclosure of security vulnerabilities:</p>
          <ol>
            <li>Email security@tokns.dev with details</li>
            <li>Include steps to reproduce</li>
            <li>Allow reasonable time for fix</li>
            <li>Do not disclose publicly before fix is released</li>
          </ol>

          <h3 id="bug-bounty">Bug Bounty Program</h3>
          <p>TOKNS offers a bug bounty for security researchers:</p>
          <ul>
            <li><strong>Critical:</strong> $500-$1000</li>
            <li><strong>High:</strong> $250-$500</li>
            <li><strong>Medium:</strong> $100-$250</li>
            <li><strong>Low:</strong> $50-$100</li>
          </ul>

          <div className="docs-alert docs-alert-warning">
            <strong>Responsible Disclosure:</strong> Please report vulnerabilities privately and allow time for fixes before public disclosure.
          </div>
        </section>

        <section>
          <h2 id="audits">Security Audits</h2>
          
          <h3 id="internal-audits">Internal Audits</h3>
          <ul>
            <li>Monthly code security reviews</li>
            <li>Dependency vulnerability scanning</li>
            <li>Penetration testing quarterly</li>
            <li>Security training for contributors</li>
          </ul>

          <h3 id="external-audits">External Audits</h3>
          <p>TOKNS undergoes regular external security audits:</p>
          <ul>
            <li><strong>Code Review:</strong> Third-party security experts</li>
            <li><strong>Penetration Testing:</strong> Certified ethical hackers</li>
            <li><strong>Compliance Audits:</strong> GDPR, SOC 2 readiness</li>
          </ul>

          <p>Audit reports are available to Pro and Enterprise customers.</p>
        </section>

        <section className="docs-cta">
          <div className="docs-cta-container">
            <h2 className="docs-cta-title">Have Security Questions?</h2>
            <p className="docs-cta-description">
              Contact our security team or report a vulnerability.
            </p>
            <div className="docs-cta-actions">
              <a href="mailto:security@tokns.dev" className="docs-btn docs-btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Security Team
              </a>
              <a href="https://github.com/Solaceking/tokns-app/security" className="docs-btn docs-btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Security Advisories
              </a>
            </div>
          </div>
        </section>
      </main>
    </DocsLayout>
  );
}
