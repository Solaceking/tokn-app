'use client';

import { Key, Github, Shield, BookOpen, Heart } from 'lucide-react';
import Link from 'next/link';

const FOOTER_LINKS = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Parser', href: '/parser' },
  ],
  resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/docs/api' },
    { label: 'Changelog', href: '/docs/changelog' },
    { label: 'Security', href: '/docs/security' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'License (MIT)', href: 'https://github.com/Solaceking/tokns-app/blob/main/LICENSE' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t-2 border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-foreground italic" style={{ transform: 'skewX(-3deg)', display: 'inline-block' }}>TOKNS</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Your token command center.
              <br />
              Secure. Parse. Sync.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Solaceking/tokns-app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <Link
                href="/docs"
                className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <BookOpen className="w-4 h-4" />
              </Link>
              <a
                href="https://github.com/sponsors/Solaceking"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:border-pink-500 hover:text-pink-500 transition-colors"
              >
                <Heart className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4 uppercase tracking-wider text-xs">Product</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4 uppercase tracking-wider text-xs">Resources</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground font-semibold mb-4 uppercase tracking-wider text-xs">Legal</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} TOKNS. Open source under MIT License.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>AES-256-GCM Encrypted</span>
            </div>
            <a
              href="https://github.com/sponsors/Solaceking"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-pink-500 hover:text-pink-400"
            >
              <Heart className="w-3 h-3" /> Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
