import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TOKN - Your Token Command Center",
  description: "Secure API token management with brutalist precision. Parse, store, and sync your tokens with zero compromise.",
  keywords: ["TOKN", "API tokens", "token management", "developer tools", "security"],
  authors: [{ name: "TOKN Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "TOKN - Your Token Command Center",
    description: "Secure API token management with brutalist precision",
    url: "https://tokn.dev",
    siteName: "TOKN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TOKN - Your Token Command Center",
    description: "Secure API token management with brutalist precision",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased bg-background text-foreground min-h-screen`}
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
        suppressHydrationWarning
      >
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
