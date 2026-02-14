'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Key, 
  Shield, 
  Search, 
  Download, 
  Settings, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Book,
  Mail,
  Github
} from 'lucide-react';
import { cn } from '@/lib/utils';

// FAQ Item component
function FAQItem({ 
  question, 
  answer 
}: { 
  question: string; 
  answer: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#404040]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#171717] transition-colors"
      >
        <span className="font-bold text-white">{question}</span>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-[#FF9F1C]" />
        ) : (
          <ChevronRight className="w-5 h-5 text-[#737373]" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-[#A3A3A3]">
          {answer}
        </div>
      )}
    </div>
  );
}

// Feature card
function FeatureCard({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}) {
  const content = (
    <div className="p-4 border-2 border-[#404040] bg-[#171717] hover:border-[#FF9F1C] transition-colors group">
      <div className="w-10 h-10 flex items-center justify-center border border-[#404040] text-[#737373] group-hover:text-[#FF9F1C] mb-3">
        {Icon}
      </div>
      <h3 className="font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-[#737373]">{description}</p>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b-2 border-[#404040]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3">
              <Key className="w-6 h-6 text-[#FF9F1C]" />
              <span className="text-xl font-bold tracking-wider italic" style={{ transform: 'skewX(-3deg)', display: 'inline-block' }}>TOKNS</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[#737373] hover:text-white">
              Dashboard
            </Link>
            <Link href="/settings" className="text-[#737373] hover:text-white">
              Settings
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-[#FF9F1C]" />
          Help & Documentation
        </h1>
        <p className="text-[#737373] mb-8">
          Everything you need to know about TOKNS
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <FeatureCard
            icon={<Key className="w-5 h-5" />}
            title="Getting Started"
            description="New to TOKNS? Start here"
            href="#getting-started"
          />
          <FeatureCard
            icon={<Shield className="w-5 h-5" />}
            title="Security"
            description="How we keep your tokens safe"
            href="#security"
          />
          <FeatureCard
            icon={<Search className="w-5 h-5" />}
            title="Features"
            description="What you can do with TOKNS"
            href="#features"
          />
          <FeatureCard
            icon={<Settings className="w-5 h-5" />}
            title="Settings"
            description="Configure your account"
            href="/settings"
          />
        </div>

        {/* Getting Started */}
        <section id="getting-started" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Book className="w-6 h-6 text-[#FF9F1C]" />
            Getting Started
          </h2>
          <div className="space-y-4 text-[#A3A3A3]">
            <p>
              Welcome to TOKNS! This guide will help you get started with managing your API tokens and keys securely.
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong className="text-white">Create an account</strong> - Sign up with your email</li>
              <li><strong className="text-white">Add your first token</strong> - Click "Add Token" on the dashboard</li>
              <li><strong className="text-white">Use AI Parser</strong> - Automatically detect tokens from text</li>
              <li><strong className="text-white">Test your tokens</strong> - Verify tokens are still valid</li>
              <li><strong className="text-white">Export</strong> - Download your tokens as .env file</li>
            </ol>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-[#404040] bg-[#171717]">
              <h3 className="font-bold text-white mb-2">🔐 Secure Storage</h3>
              <p className="text-sm text-[#737373]">
                All tokens are encrypted with AES-256-GCM before being stored. Only you can decrypt them.
              </p>
            </div>
            <div className="p-4 border border-[#404040] bg-[#171717]">
              <h3 className="font-bold text-white mb-2">🤖 AI Parser</h3>
              <p className="text-sm text-[#737373]">
                Paste any text containing API keys and our AI will automatically detect and categorize them.
              </p>
            </div>
            <div className="p-4 border border-[#404040] bg-[#171717]">
              <h3 className="font-bold text-white mb-2">✅ Token Testing</h3>
              <p className="text-sm text-[#737373]">
                Test if your tokens are still valid. Supports OpenAI, GitHub, Stripe, Google, and more.
              </p>
            </div>
            <div className="p-4 border border-[#404040] bg-[#171717]">
              <h3 className="font-bold text-white mb-2">📦 Export</h3>
              <p className="text-sm text-[#737373]">
                Export all your tokens to .env format for easy use in your projects.
              </p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#FF9F1C]" />
            Security
          </h2>
          <div className="space-y-4 text-[#A3A3A3]">
            <p>
              Security is our top priority. Here's how we protect your tokens:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-[#FF9F1C]">✓</span>
                <span><strong className="text-white">AES-256-GCM Encryption</strong> - Industry-standard encryption</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF9F1C]">✓</span>
                <span><strong className="text-white">Server-side Decryption</strong> - Tokens are only decrypted when needed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF9F1C]">✓</span>
                <span><strong className="text-white">Supabase Auth</strong> - Secure authentication</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF9F1C]">✓</span>
                <span><strong className="text-white">No Plain Text</strong> - Tokens are never stored in plain text</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Keyboard Shortcuts</h2>
          <div className="border border-[#404040]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#404040]">
                  <th className="text-left p-3 text-[#737373] font-bold">Shortcut</th>
                  <th className="text-left p-3 text-[#737373] font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#262626]">
                  <td className="p-3 font-mono text-[#FF9F1C]">Ctrl + K</td>
                  <td className="p-3 text-[#A3A3A3]">Focus search</td>
                </tr>
                <tr className="border-b border-[#262626]">
                  <td className="p-3 font-mono text-[#FF9F1C]">Ctrl + N</td>
                  <td className="p-3 text-[#A3A3A3]">Add new token</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-[#FF9F1C]">Escape</td>
                  <td className="p-3 text-[#A3A3A3]">Close modal</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            <FAQItem
              question="Is TOKNS free to use?"
              answer="Yes! TOKNS is completely free and open source. We're exploring optional donations in the future."
            />
            <FAQItem
              question="Where are my tokens stored?"
              answer="Your tokens are stored in a Supabase PostgreSQL database with AES-256-GCM encryption. We never store tokens in plain text."
            />
            <FAQItem
              question="Can I self-host TOKNS?"
              answer="Yes! TOKNS is open source. You can deploy it on your own server or Vercel account. Check the README for deployment instructions."
            />
            <FAQItem
              question="What happens if I forget my password?"
              answer="Use the password reset feature on the login page. TOKNS uses Supabase Auth for secure password management."
            />
            <FAQItem
              question="How does the AI parser work?"
              answer="The AI parser uses your configured AI provider (like OpenAI) to analyze text and identify API tokens. You can configure your AI provider in Settings."
            />
            <FAQItem
              question="Which services does token testing support?"
              answer="Currently supports: OpenAI, GitHub, Stripe, Google Cloud, SendGrid, Twilio, and generic Bearer token authentication."
            />
            <FAQItem
              question="Can I import tokens from other apps?"
              answer="Yes! Use the AI Parser to paste text containing multiple tokens, or manually add them one by one."
            />
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Get Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://github.com/Solaceking/tokns-app"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-[#404040] bg-[#171717] hover:border-[#FF9F1C] transition-colors flex items-center gap-3"
            >
              <Github className="w-5 h-5 text-[#737373]" />
              <div>
                <div className="font-bold text-white">GitHub</div>
                <div className="text-xs text-[#737373]">Report issues</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#737373] ml-auto" />
            </a>
            <a
              href="mailto:support@tokns.app"
              className="p-4 border border-[#404040] bg-[#171717] hover:border-[#FF9F1C] transition-colors flex items-center gap-3"
            >
              <Mail className="w-5 h-5 text-[#737373]" />
              <div>
                <div className="font-bold text-white">Email</div>
                <div className="text-xs text-[#737373]">Get in touch</div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#737373] ml-auto" />
            </a>
            <Link
              href="/settings"
              className="p-4 border border-[#404040] bg-[#171717] hover:border-[#FF9F1C] transition-colors flex items-center gap-3"
            >
              <Settings className="w-5 h-5 text-[#737373]" />
              <div>
                <div className="font-bold text-white">Settings</div>
                <div className="text-xs text-[#737373]">Account settings</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#737373] ml-auto" />
            </Link>
          </div>
        </section>

        {/* Version */}
        <div className="text-center text-[#525252] text-sm">
          <p>TOKNS v1.0.0 • Open Source Token Manager</p>
        </div>
      </div>
    </div>
  );
}
