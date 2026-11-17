import { Poppins, Great_Vibes } from "next/font/google";
import "./globals.css";
import ReferralTracker from "@/components/ReferralTracker";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import type { Metadata } from "next";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Rysee | Digital Products & Jasa Website',
    template: '%s | Rysee'
  },
  description: 'Platform affiliate untuk jualan produk digital tanpa stok. Temukan jasa website premium dan produk digital berkualitas untuk mempercepat bisnis Anda. Mulai bisnis digital tanpa modal stok sekarang.',
  keywords: ['digital products', 'Jasa Website', 'notion templates', 'canva templates', 'e-books', 'website solution', 'produk digital', 'template bisnis'],
  authors: [{ name: 'Agung Prayitno' }],
  creator: 'Agung Prayitno',
  publisher: 'Agung Prayitno',
  icons: {
    icon: '/images/logo.jpeg',
    apple: '/images/logo.jpeg',
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
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://rysee.my.id',
    title: 'Rysee | Digital Products & Website Templates',
    description: 'Temukan template website premium dan produk digital berkualitas untuk mempercepat bisnis Anda.',
    siteName: 'Rysee',
    images: [
      {
        url: 'https://rysee.my.id/images/digital.jpg',
        width: 1200,
        height: 630,
        alt: 'Rysee - Digital Products & Website Templates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rysee | Digital Products & Website Templates',
    description: 'Temukan template website premium dan produk digital berkualitas untuk mempercepat bisnis Anda.',
    images: ['https://rysee.my.id/images/digital.jpg'],
    creator: '@rysee',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={`${poppins.variable} ${greatVibes.variable}`}>
      <head>
        <link rel="canonical" href="https://rysee.my.id" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Rysee" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Rysee',
              url: 'https://rysee.my.id',
              description: 'Temukan template website premium dan produk digital berkualitas untuk mempercepat bisnis Anda.',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://rysee.my.id/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased bg-[#F5F5F5] text-[#0A0A0A] selection:bg-black selection:text-white min-h-screen flex flex-col font-sans">
        
        {/* Referral Tracker - handles referral tracking for logged-in users */}
        <ReferralTracker />
        
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />
        
        {/* Konten Utama: Ini yang bikin halaman kamu muncul */}
        <main className="flex-grow">
          {children}
        </main>
        
      </body>
    </html>
  );
}