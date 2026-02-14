import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | TOKNS',
  description: 'Terms of Service for TOKNS - Your Token Command Center',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="text-primary hover:underline mb-8 inline-block">
          &larr; Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: February 14, 2026</p>

        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using TOKNS (&quot;the Service&quot;), you agree to be bound by these Terms of 
              Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not use the Service. 
              These Terms constitute a legally binding agreement between you and TOKNS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">2. Description of Service</h2>
            <p className="text-muted-foreground">
              TOKNS provides a secure token management platform that allows users to store, manage, 
              and organize API tokens and credentials. The Service includes features for token 
              encryption, parsing, and synchronization across your workflow.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">3. User Accounts</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">4. Acceptable Use</h2>
            <p className="text-muted-foreground mb-3">You agree not to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Store tokens or credentials you do not have authorization to possess</li>
              <li>Attempt to breach or circumvent our security measures</li>
              <li>Use the Service to store malicious code or facilitate cyberattacks</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Attempt to access other users&apos; data without authorization</li>
              <li>Use automated systems to access the Service without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">5. Intellectual Property</h2>
            <p className="text-muted-foreground">
              The TOKNS platform, including its original content, features, and functionality, is 
              owned by TOKNS and is protected by international copyright, trademark, and other 
              intellectual property laws. Our source code is available under the MIT License as 
              stated in our public repository.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">6. User Data</h2>
            <p className="text-muted-foreground">
              You retain ownership of all tokens and credentials you store in the Service. TOKNS 
              does not claim ownership of your data. You grant TOKNS a limited license to process 
              and store your data solely for the purpose of providing the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">7. Security</h2>
            <p className="text-muted-foreground">
              While we implement industry-standard security measures including AES-256-GCM encryption, 
              no method of transmission over the Internet is 100% secure. We cannot guarantee absolute 
              security of your data. You acknowledge that you provide your data at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">8. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TOKNS SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO 
              LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">9. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF 
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">10. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless TOKNS and its affiliates from any claims, 
              damages, losses, or expenses arising from your use of the Service or violation of 
              these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">11. Service Modifications</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify, suspend, or discontinue the Service at any time without 
              notice. We shall not be liable to you or any third party for any modification, suspension, 
              or discontinuation of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">12. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles. Any disputes arising from these Terms 
              or your use of the Service shall be resolved through good faith negotiation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">13. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may modify these Terms at any time. We will notify users of material changes by 
              posting the updated Terms on this page with a new &quot;Last updated&quot; date. Your continued 
              use of the Service after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-foreground">14. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, please contact us at:
            </p>
            <ul className="list-none text-muted-foreground mt-2 space-y-1">
              <li>Email: legal@tokns.dev</li>
              <li>GitHub: <a href="https://github.com/Solaceking/tokns-app" className="text-primary hover:underline">github.com/Solaceking/tokns-app</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}