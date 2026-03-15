import { RootProvider } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';
import { Inter, Archivo, Roboto_Mono } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata, Viewport } from 'next';
import './global.css';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  metadataBase: new URL('https://dev-flow.xyz'),
  title: {
    default: 'DevFlow – Bootstrap Your Dev Workflow in Seconds',
    template: '%s | DevFlow',
  },
  description:
    'DevFlow is a CLI tool that scaffolds a complete development workflow — Git hooks, commit conventions, ESLint, Prettier, Vitest, CI/CD, Docker, security, and more — in any repository via an interactive wizard.',
  keywords: [
    'devflow',
    'create-devflow',
    'npx create-devflow',
    'bootstrap developer workflow',
    'automate dev workflow setup',
    'scaffold nodejs project',
    'project setup automation cli',
    'developer tooling cli',
    'how to add husky to project',
    'how to setup eslint nodejs',
    'how to configure prettier typescript',
    'how to add github actions nodejs',
    'how to write dockerfile nodejs',
    'nextjs developer setup',
    'react project boilerplate',
    'nestjs eslint setup',
    'vue typescript lint setup',
    'git hooks automation',
    'conventional commits setup',
    'ci cd pipeline nodejs',
    'monorepo tooling setup',
    'typescript eslint prettier config',
  ],
  authors: [{ name: 'DevFlow' }],
  creator: 'DevFlow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dev-flow.xyz',
    siteName: 'DevFlow',
    title: 'DevFlow – Bootstrap Your Dev Workflow in Seconds',
    description:
      'Scaffold Git hooks, linting, testing, CI/CD, Docker, and more in any repo with one command: npx create-devflow.',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'DevFlow – Bootstrap Your Dev Workflow in Seconds',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevFlow – Bootstrap Your Dev Workflow in Seconds',
    description:
      'Scaffold Git hooks, linting, testing, CI/CD, Docker, and more in any repo with one command: npx create-devflow.',
    images: ['/og-image.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://dev-flow.xyz',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['400', '500', '600', '700'],
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  weight: ['400', '500', '600', '700'],
});

async function getGithubStars(): Promise<number | null> {
  try {
    const res = await fetch('https://api.github.com/repos/disin8/devflow', {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export default async function Layout({ children }: { children: ReactNode }) {
  const stars = await getGithubStars();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://dev-flow.xyz/#organization',
        name: 'DevFlow',
        url: 'https://dev-flow.xyz',
        logo: {
          '@type': 'ImageObject',
          url: 'https://dev-flow.xyz/og-image.webp',
          width: 1200,
          height: 630,
        },
        description:
          'DevFlow is a CLI tool that scaffolds a complete development workflow — Git hooks, commit conventions, ESLint, Prettier, Vitest, CI/CD, Docker, and more — in any JavaScript/TypeScript repository.',
        sameAs: ['https://github.com/disin8/devflow', 'https://www.npmjs.com/package/create-devflow'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://dev-flow.xyz/#website',
        url: 'https://dev-flow.xyz',
        name: 'DevFlow',
        description: 'Bootstrap your entire dev workflow in seconds with npx create-devflow.',
        publisher: { '@id': 'https://dev-flow.xyz/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://dev-flow.xyz/docs?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
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
          <Navbar stars={stars} />
          {children}
        </RootProvider>
      </body>
      <GoogleAnalytics gaId="G-8GCMNKB6HG" />
    </html>
  );
}
