import { Metadata } from "next";
import DocsLayout from "@/components/docs/DocsLayout";
import CodeBlock from "@/components/docs/CodeBlock";
import "@/styles/docs/docs.css";

export const metadata: Metadata = {
  title: "API Reference - TOKNS Documentation",
  description: "REST API endpoints for integrating TOKNS with your applications.",
};

export default function ApiPage() {
  return (
    <DocsLayout activePage="api">
      <main className="docs-content">
        <header className="docs-content-header">
          <h1 className="docs-content-title">TOKNS API Reference</h1>
          <p className="docs-content-subtitle">REST API endpoints for integrating TOKNS with your applications.</p>
        </header>

        <div className="docs-alert docs-alert-info">
          <strong>Authentication:</strong> All API requests require a valid API key. Generate keys in Settings → API Keys.
        </div>

        <section>
          <h2 id="authentication">Authentication</h2>
          <p>Include your API key in the Authorization header:</p>
          <CodeBlock language="bash">{`Authorization: Bearer YOUR_API_KEY`}</CodeBlock>
          
          <p>Or as a query parameter:</p>
          <CodeBlock language="bash">{`GET /api/tokens?apiKey=YOUR_API_KEY`}</CodeBlock>

          <h3 id="rate-limiting">Rate Limiting</h3>
          <ul>
            <li><strong>Free tier:</strong> 100 requests/hour</li>
            <li><strong>Pro tier:</strong> 1,000 requests/hour</li>
            <li>Exceeding limits returns HTTP 429 (Too Many Requests)</li>
          </ul>
        </section>

        <section>
          <h2 id="endpoints">Endpoints</h2>

          <h3 id="tokens">Tokens</h3>

          <h4 id="list-tokens">List Tokens</h4>
          <CodeBlock language="bash">{`GET /api/tokens`}</CodeBlock>
          
          <p><strong>Response:</strong></p>
          <CodeBlock language="json">
{`{
  "tokens": [
    {
      "id": "token_123",
      "service": "OpenAI",
      "description": "Production API key",
      "category": "AI/ML",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50
}`}
          </CodeBlock>

          <h4 id="get-token">Get Token</h4>
          <CodeBlock language="bash">{`GET /api/tokens/{id}`}</CodeBlock>
          
          <p><strong>Response:</strong></p>
          <CodeBlock language="json">
{`{
  "id": "token_123",
  "service": "OpenAI",
  "token": "encrypted_token_data",
  "description": "Production API key",
  "category": "AI/ML",
  "status": "ACTIVE",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}`}
          </CodeBlock>

          <h4 id="create-token">Create Token</h4>
          <CodeBlock language="bash">{`POST /api/tokens`}</CodeBlock>
          
          <p><strong>Request Body:</strong></p>
          <CodeBlock language="json">
{`{
  "service": "OpenAI",
  "token": "sk-abc123",
  "description": "Production API key",
  "category": "AI/ML"
}`}
          </CodeBlock>

          <h4 id="update-token">Update Token</h4>
          <CodeBlock language="bash">{`PUT /api/tokens/{id}`}</CodeBlock>
          
          <p><strong>Request Body:</strong></p>
          <CodeBlock language="json">
{`{
  "description": "Updated description",
  "category": "Development"
}`}
          </CodeBlock>

          <h4 id="delete-token">Delete Token</h4>
          <CodeBlock language="bash">{`DELETE /api/tokens/{id}`}</CodeBlock>
        </section>

        <section>
          <h3 id="token-operations">Token Operations</h3>

          <h4 id="test-token">Test Token</h4>
          <CodeBlock language="bash">{`POST /api/tokens/{id}/test`}</CodeBlock>
          
          <p><strong>Response:</strong></p>
          <CodeBlock language="json">
{`{
  "success": true,
  "message": "Token is valid",
  "statusCode": 200,
  "responseTime": 150
}`}
          </CodeBlock>

          <h4 id="decrypt-token">Decrypt Token</h4>
          <CodeBlock language="bash">{`POST /api/tokens/{id}/decrypt`}</CodeBlock>
          
          <p><strong>Response:</strong></p>
          <CodeBlock language="json">
{`{
  "token": "sk-abc123",
  "validFor": 300
}`}
          </CodeBlock>

          <div className="docs-alert docs-alert-warning">
            <strong>Security Note:</strong> Decrypted tokens are only available for 5 minutes before being re-encrypted.
          </div>
        </section>

        <section>
          <h3 id="parser">Parser API</h3>

          <h4 id="parse-text">Parse Text for Tokens</h4>
          <CodeBlock language="bash">POST /api/parse</CodeBlock>
          
          <p><strong>Request Body:</strong></p>
          <CodeBlock language="json">
{`{
  "text": "OPENAI_API_KEY=sk-abc123\\nGITHUB_TOKEN=ghp_xyz789",
  "autoSave": false
}`}
          </CodeBlock>

          <p><strong>Response:</strong></p>
          <CodeBlock language="json">
{`{
  "tokens": [
    {
      "service": "OpenAI",
      "token": "sk-abc123",
      "confidence": 0.95
    },
    {
      "service": "GitHub",
      "token": "ghp_xyz789",
      "confidence": 0.92
    }
  ]
}`}
          </CodeBlock>

          <h4 id="ai-parser">AI-Powered Parser</h4>
          <CodeBlock language="bash">POST /api/parse/ai</CodeBlock>
          
          <p><strong>Request Body:</strong></p>
          <CodeBlock language="json">
{`{
  "text": "My OpenAI key is sk-abc123 and GitHub token is ghp_xyz789",
  "model": "gpt-4"
}`}
          </CodeBlock>
        </section>

        <section>
          <h3 id="activities">Activities</h3>

          <h4 id="list-activities">List Activities</h4>
          <CodeBlock language="bash">GET /api/activities</CodeBlock>
          
          <p><strong>Query Parameters:</strong></p>
          <ul>
            <li><code>action</code>: Filter by action type</li>
            <li><code>service</code>: Filter by service</li>
            <li><code>from</code>: Start date (ISO format)</li>
            <li><code>to</code>: End date (ISO format)</li>
            <li><code>limit</code>: Results per page (default: 50)</li>
            <li><code>page</code>: Page number (default: 1)</li>
          </ul>
        </section>

        <section>
          <h3 id="user">User Management</h3>

          <h4 id="get-user">Get Current User</h4>
          <CodeBlock language="bash">GET /api/user</CodeBlock>
          
          <p><strong>Response:</strong></p>
          <CodeBlock language="json">
{`{
  "id": "user_123",
  "email": "user@example.com",
  "username": "developer",
  "fullName": "John Developer",
  "tier": "pro",
  "tokenCount": 42,
  "maxTokens": 1000,
  "createdAt": "2024-01-01T00:00:00Z"
}`}
          </CodeBlock>

          <h4 id="api-keys">API Keys</h4>
          <CodeBlock language="bash">GET /api/api-keys</CodeBlock>
          <CodeBlock language="bash">POST /api/api-keys</CodeBlock>
          <CodeBlock language="bash">{`DELETE /api/api-keys/{id}`}</CodeBlock>
        </section>

        <section>
          <h2 id="error-handling">Error Handling</h2>
          
          <h3 id="error-codes">Error Codes</h3>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>400</strong></td>
                <td>Bad Request - Invalid parameters</td>
              </tr>
              <tr>
                <td><strong>401</strong></td>
                <td>Unauthorized - Invalid or missing API key</td>
              </tr>
              <tr>
                <td><strong>403</strong></td>
                <td>Forbidden - Insufficient permissions</td>
              </tr>
              <tr>
                <td><strong>404</strong></td>
                <td>Not Found - Resource doesn&apos;t exist</td>
              </tr>
              <tr>
                <td><strong>429</strong></td>
                <td>Too Many Requests - Rate limit exceeded</td>
              </tr>
              <tr>
                <td><strong>500</strong></td>
                <td>Internal Server Error</td>
              </tr>
            </tbody>
          </table>

          <h3 id="error-response">Error Response Format</h3>
          <CodeBlock language="json">
{`{
  "error": "Invalid API key",
  "code": "INVALID_API_KEY",
  "details": "The provided API key is invalid or expired"
}`}
          </CodeBlock>
        </section>

        <section>
          <h2 id="client-libraries">Client Libraries</h2>
          
          <h3 id="javascript">JavaScript/Node.js</h3>
          <CodeBlock language="bash">npm install tokns-client</CodeBlock>
          
          <CodeBlock language="typescript" filename="example.ts">
{`import { ToknsClient } from 'tokns-client';

const client = new ToknsClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://your-tokns-instance.com'
});

// List tokens
const tokens = await client.tokens.list();

// Create token
const newToken = await client.tokens.create({
  service: 'OpenAI',
  token: 'sk-abc123',
  description: 'Production key'
});`}
          </CodeBlock>

          <h3 id="python">Python</h3>
          <CodeBlock language="bash">pip install tokns-python</CodeBlock>
          
          <CodeBlock language="python" filename="example.py">
{`from tokns import ToknsClient

client = ToknsClient(api_key="YOUR_API_KEY")

# List tokens
tokens = client.tokens.list()

# Test a token
result = client.tokens.test("token_id")`}
          </CodeBlock>

          <h3 id="curl">cURL Examples</h3>
          <CodeBlock language="bash">
{`# List tokens
curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://your-tokns-instance.com/api/tokens

# Create token
curl -X POST -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"service":"OpenAI","token":"sk-abc123"}' \\
  https://your-tokns-instance.com/api/tokens`}
          </CodeBlock>
        </section>

        <section className="docs-cta">
          <div className="docs-cta-container">
            <h2 className="docs-cta-title">Need API Help?</h2>
            <p className="docs-cta-description">
              Join our developer community or open an issue for support.
            </p>
            <div className="docs-cta-actions">
              <a href="https://github.com/Solaceking/tokns-app/issues" className="docs-btn docs-btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                API Issues
              </a>
              <a href="https://github.com/Solaceking/tokns-app/discussions" className="docs-btn docs-btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Developer Discussions
              </a>
            </div>
          </div>
        </section>
      </main>
    </DocsLayout>
  );
}
