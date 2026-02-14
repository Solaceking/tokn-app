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
  title: "TOKNS - Your Token Command Center",
  description: "Secure API token management with brutalist precision. Parse, store, and sync your tokens with zero compromise.",
  keywords: ["TOKNS", "API tokens", "token management", "developer tools", "security", "token vault", "API keys"],
  authors: [{ name: "TOKNS Team" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.svg",
  },
  openGraph: {
    title: "TOKNS - Your Token Command Center",
    description: "Secure API token management with brutalist precision. Parse, store, and sync your tokens with zero compromise.",
    url: "https://tokns.dev",
    siteName: "TOKNS",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TOKNS - Your Token Command Center",
    description: "Secure API token management with brutalist precision",
    creator: "@tokns",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
