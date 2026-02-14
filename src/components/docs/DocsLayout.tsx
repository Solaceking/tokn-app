"use client";

import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

interface DocsLayoutProps {
  children: ReactNode;
  activePage?: string;
}

const navigation = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    id: "getting-started",
  },
  {
    title: "Guides",
    href: "/docs/guides",
    id: "guides",
  },
  {
    title: "API Reference",
    href: "/docs/api",
    id: "api",
  },
  {
    title: "Security",
    href: "/docs/security",
    id: "security",
  },
  {
    title: "Contributing",
    href: "/docs/contributing",
    id: "contributing",
  },
  {
    title: "Changelog",
    href: "/docs/changelog",
    id: "changelog",
  },
];

export function DocsNav({ activePage }: { activePage?: string }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`docs-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="docs-container docs-nav-container">
        <Link href="/docs" className="docs-nav-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="docs-nav-logo-text">TOKNS</span>
        </Link>
        
        <div className="docs-nav-center">
          {navigation.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`docs-nav-link ${activePage === item.id ? "active" : ""}`}
            >
              {item.title}
            </Link>
          ))}
        </div>
        
        <div className="docs-nav-right">
          <Link href="/" className="docs-back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to App
          </Link>
          <a 
            href="https://github.com/Solaceking/tokns-app" 
            className="docs-github-link" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export function DocsSidebar({ activePage }: { activePage?: string }) {
  return (
    <aside className="docs-sidebar">
      <div className="docs-sidebar-content">
        <div className="docs-sidebar-section">
          <h3 className="docs-sidebar-title">Documentation</h3>
          <nav className="docs-sidebar-nav">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`docs-sidebar-link ${activePage === item.id ? "active" : ""}`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="docs-sidebar-section">
          <h3 className="docs-sidebar-title">Resources</h3>
          <nav className="docs-sidebar-nav">
            <a
              href="https://github.com/Solaceking/tokns-app"
              className="docs-sidebar-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </a>
            <a
              href="https://github.com/Solaceking/tokns-app/issues"
              className="docs-sidebar-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report an Issue
            </a>
            <a
              href="https://github.com/Solaceking/tokns-app/discussions"
              className="docs-sidebar-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discussions
            </a>
          </nav>
        </div>
      </div>
    </aside>
  );
}

export function DocsFooter() {
  return (
    <footer className="docs-footer">
      <div className="docs-container docs-footer-container">
        <div className="docs-footer-brand">
          <Link href="/" className="docs-footer-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>TOKNS</span>
          </Link>
          <p className="docs-footer-tagline">Secure token management for developers</p>
        </div>
        <div className="docs-footer-links">
          <div className="docs-footer-column">
            <h4 className="docs-footer-column-title">Documentation</h4>
            <Link href="/docs/getting-started" className="docs-footer-link">Getting Started</Link>
            <Link href="/docs/guides" className="docs-footer-link">User Guides</Link>
            <Link href="/docs/api" className="docs-footer-link">API Reference</Link>
            <Link href="/docs/security" className="docs-footer-link">Security</Link>
          </div>
          <div className="docs-footer-column">
            <h4 className="docs-footer-column-title">Community</h4>
            <Link href="/docs/contributing" className="docs-footer-link">Contributing</Link>
            <Link href="/docs/changelog" className="docs-footer-link">Changelog</Link>
            <a href="https://github.com/Solaceking/tokns-app/issues" className="docs-footer-link" target="_blank" rel="noopener noreferrer">Issue Tracker</a>
            <a href="https://github.com/Solaceking/tokns-app/discussions" className="docs-footer-link" target="_blank" rel="noopener noreferrer">Discussions</a>
          </div>
          <div className="docs-footer-column">
            <h4 className="docs-footer-column-title">Legal</h4>
            <a href="https://github.com/Solaceking/tokns-app/blob/main/LICENSE" className="docs-footer-link" target="_blank" rel="noopener noreferrer">License (MIT)</a>
            <a href="https://www.privacypolicytemplate.net/live.php?token=WkVmMlNwNDRhZ1VMNUdGR" className="docs-footer-link" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <a href="https://www.termsofservicegenerator.net/live.php?token=UHJVTklRVkVZSldYVkVB" className="docs-footer-link" target="_blank" rel="noopener noreferrer">Terms of Service</a>
            <Link href="/docs/security#reporting" className="docs-footer-link">Security Disclosure</Link>
          </div>
        </div>
      </div>
      <div className="docs-footer-bottom">
        <div className="docs-container">
          <p className="docs-footer-copyright">
            © {new Date().getFullYear()} TOKNS. Open source under MIT License.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function DocsLayout({ children, activePage }: DocsLayoutProps) {
  return (
    <div className="docs-wrapper">
      <DocsNav activePage={activePage} />
      <div className="docs-layout-body">
        <DocsSidebar activePage={activePage} />
        <div className="docs-main-content">
          {children}
        </div>
      </div>
      <DocsFooter />
    </div>
  );
}
