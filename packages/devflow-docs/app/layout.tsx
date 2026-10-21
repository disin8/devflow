import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata, Viewport } from 'next';
import './global.css';
import { Navbar } from '@/components/navbar';
import { GITHUB_URL, NPM_URL, SITE_BRAND, SITE_URL } from '@/lib/site';
import { keywordsFor } from '@/lib/keywords';
import { organizationSchema, ogImageUrl, webSiteSchema } from '@/lib/seo';
import { getProjectProof } from '@/lib/proof';

const inter = localFont({
  src: './fonts/inter.woff2',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

const archivo = localFont({
  src: './fonts/archivo.woff2',
  variable: '--font-archivo',
  weight: '100 900',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
});

const robotoMono = localFont({
  src: './fonts/robotomono.woff2',
  variable: '--font-roboto-mono',
  weight: '100 700',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DevFlow CLI — Developer Workflow Setup for TypeScript, React, Node.js and Monorepos",
    template: "%s | DevFlow CLI",
  },
  description:
    "Generate ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configs for your existing TypeScript project — without copy-pasting boilerplate. MIT licensed, 50 modules, one command.",
  keywords: keywordsFor("/"),
  applicationName: "DevFlow CLI",
  authors: [{ name: "DevFlow", url: GITHUB_URL }],
  creator: "DevFlow",
  publisher: "DevFlow",
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_BRAND,
    title: "DevFlow CLI — Developer Workflow Setup for TypeScript, React, Node.js and Monorepos",
    description:
      "Generate ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configs for your existing TypeScript project — without copy-pasting boilerplate.",
    images: [ogImageUrl()],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevFlow CLI — Developer Workflow Setup for TypeScript, React, Node.js and Monorepos",
    description:
      "Generate ESLint, Prettier, Husky, Vitest, GitHub Actions, Docker and security configs for your existing TypeScript project — without copy-pasting boilerplate.",
    images: [ogImageUrl().url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [{ rel: "manifest", url: "/site.webmanifest" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default async function Layout({ children }: { children: ReactNode }) {
  const proof = await getProjectProof();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), webSiteSchema()],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivo.variable} ${robotoMono.variable} ${inter.className}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <Navbar
            stars={proof.github?.stars ?? null}
            version={proof.npm?.version ?? null}
          />
          {children}
        </RootProvider>
      </body>
      <GoogleAnalytics gaId="G-8GCMNKB6HG" />
    </html>
  );
}
