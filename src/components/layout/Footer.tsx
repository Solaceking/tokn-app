'use client';

import { Key, Github, Mail, Shield } from 'lucide-react';

const FOOTER_LINKS = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Parser', href: '/parser' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Security', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t-2 border-[#404040] bg-[#0a0a0a]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-6 h-6 text-[#FF9F1C]" />
              <span className="text-xl font-bold text-white">TOKN</span>
            </div>
            <p className="text-sm text-[#525252] mb-4">
              Your token command center.
              <br />
              Secure. Parse. Sync.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center border border-[#404040] text-[#737373] hover:border-[#FF9F1C] hover:text-[#FF9F1C] transition-colors"
              >
                <Shield className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#737373] hover:text-[#FF9F1C] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#737373] hover:text-[#FF9F1C] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#737373] hover:text-[#FF9F1C] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#262626] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#525252]">
            © {new Date().getFullYear()} TOKN. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-[#525252]">
            <span>Built with</span>
            <span className="text-[#FF9F1C] font-bold">●</span>
            <span>for developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
