import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cairo, Amiri, Tajawal } from "next/font/google";
import "./globals.css";
import { AtharProvider } from "@/components/providers/AtharProvider";
import { AtharShell } from "@/components/layout/AtharShell";
import { APP_SITE_URL } from "@/lib/constants";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A2E22",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_SITE_URL),
  title: {
    default: "ATHAR | أَثَر — اترك أثرًا يبقى بعدك",
    template: "%s | ATHAR أَثَر",
  },
  description:
    "منظومة رقمية إسلامية متكاملة تجمع بين القرآن الكريم والأذكار الموثقة والأدعية والمسبحة ومواقيت الصلاة والقبلة والتقويم الهجري والدعوات والحملات والمجتمعات واستوديو التصميم الفاخر.",
  applicationName: "ATHAR | أَثَر",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: APP_SITE_URL,
    siteName: "ATHAR | أَثَر",
    title: "ATHAR | أَثَر — اترك أثرًا يبقى بعدك",
    description:
      "المنظومة الرقمية الإسلامية المتكاملة للعبادة والقرآن والأذكار والدعوات والحملات والمجتمعات.",
    images: [
      {
        url: "/images/athar-og-default.png",
        width: 1200,
        height: 630,
        alt: "ATHAR | أَثَر — اترك أثرًا يبقى بعدك",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATHAR | أَثَر — اترك أثرًا يبقى بعدك",
    description: "المنظومة الرقمية الإسلامية المتكاملة للعبادة والأثر الرقمي.",
    images: ["/images/athar-og-default.png"],
  },
};

const themePreloadScript = `
(function(){
  try {
    var t = localStorage.getItem('athar_theme') || 'midnight-dark';
    if (t === 'system') {
      t = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'midnight-dark';
    }
    document.documentElement.setAttribute('data-theme', t);
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ATHAR | أَثَر",
    alternateName: "أَثَر",
    url: APP_SITE_URL,
    description: "منظومة رقمية إسلامية متكاملة — اترك أثرًا يبقى بعدك",
    inLanguage: "ar",
  };

  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${cairo.variable} ${amiri.variable} ${tajawal.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themePreloadScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-[#D4AF37]/30 selection:text-[#F8E5A7]">
        <AtharProvider>
          <AtharShell>{children}</AtharShell>
        </AtharProvider>
      </body>
    </html>
  );
}
