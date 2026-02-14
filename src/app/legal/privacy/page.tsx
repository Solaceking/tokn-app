import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | TOKNS',
  description: 'Privacy Policy for TOKNS - Your Token Command Center',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="text-primary hover:underline mb-8 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: February 14, 2026</p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">1. Introduction</h2>
            <p className="text-muted-foreground">
              TOKNS (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting 
              your personal data. This privacy policy explains how we collect, use, and safeguard 
              your information when you use our token management services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">2. Information We Collect</h2>
            <p className="text-muted-foreground mb-3">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Account Information:</strong> Email address, username, and authentication credentials.</li>
              <li><strong className="text-foreground">Token Data:</strong> API tokens and service identifiers you store in our platform. All tokens are encrypted using AES-256-GCM encryption.</li>
              <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our service, including features used and timestamps.</li>
              <li><strong className="text-foreground">Device Information:</strong> Browser type, operating system, and device identifiers for security purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">3. How We Use Your Information</h2>
            <p className="text-muted-foreground mb-3">We use your information to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Provide, maintain, and improve our token management services</li>
              <li>Authenticate your identity and secure your account</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Detect and prevent fraud, abuse, and security issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">4. Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your data. All stored tokens 
              are encrypted using AES-256-GCM encryption. We use secure connections (HTTPS) for all 
              data transmission and employ authentication mechanisms to prevent unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">5. Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your information for as long as your account is active or as needed to provide 
              you services. Upon account deletion, all your data, including stored tokens, will be 
              permanently removed from our systems within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">6. Third-Party Services</h2>
            <p className="text-muted-foreground">
              We may use third-party services for authentication, analytics, and infrastructure. 
              These providers have access to your information only to perform specific tasks on our 
              behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">7. Your Rights</h2>
            <p className="text-muted-foreground mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">8. Cookies</h2>
            <p className="text-muted-foreground">
              We use essential cookies to maintain your session and authentication state. We do not 
              use tracking cookies or share cookie data with third parties for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">9. Children&apos;s Privacy</h2>
            <p className="text-muted-foreground">
              Our services are not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If you believe we have collected 
              information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">10. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new privacy policy on this page and updating the &quot;Last updated&quot; date. 
              Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">11. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this privacy policy, please contact us at:
            </p>
            <ul className="list-none text-muted-foreground mt-2 space-y-1">
              <li>Email: privacy@tokns.dev</li>
              <li>GitHub: <a href="https://github.com/Solaceking/tokns-app" className="text-primary hover:underline">github.com/Solaceking/tokns-app</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}