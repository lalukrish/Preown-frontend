import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import WhatsAppButton from "@/components/WhatsAppButton/WhatsAppButton";
import { AppSnackbarProvider } from "@/components/Common/snackbar";
import FooterNew from "@/components/Footer/footer-new";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "http://preown.store";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Preown by applebae - Premium Pre-Owned Phones & Gadgets",
    template: "%s | Preown by applebae",
  },
  description:
    "Your trusted source for premium phones and the latest gadgets. Discover top brands, unbeatable deals, and expert support.",
  keywords: [
    "premium phones",
    "pre-owned phones",
    "latest gadgets",
    "top brands",
    "unbeatable deals",
    "expert support",
    "used phones",
    "refurbished phones",
    "Calicut",
    "Kochi",
    "Kerala",
  ],
  authors: [{ name: "Preown by applebae" }],
  creator: "Preown by applebae",
  publisher: "Preown by applebae",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Preown by applebae",
    title: "Preown by applebae - Premium Pre-Owned Phones & Gadgets",
    description:
      "Your trusted source for premium phones and the latest gadgets. Discover top brands, unbeatable deals, and expert support.",
    images: [
      {
        url: `${SITE_URL}/logo.svg`,
        width: 1200,
        height: 630,
        alt: "Preown by applebae - Premium Pre-Owned Phones & Gadgets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Preown by applebae - Premium Pre-Owned Phones & Gadgets",
    description:
      "Your trusted source for premium phones and the latest gadgets. Discover top brands, unbeatable deals, and expert support.",
    images: [`${SITE_URL}/logo.svg`],
    creator: "@preownbyapplebae", // Update with your actual Twitter handle if available
  },
  verification: {
    google: "XC1b9NJ6BRQPEJNrLM2IVDpCsHjMRk59c347fetOukk",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  category: "Electronics",
  classification: "E-commerce",
  manifest: "/manifest.json",
  icons: {
    icon: "/logoIcon.svg",
    shortcut: "/logoIcon.svg",
    apple: "/logoIcon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Preown by applebae",
  },
};

// Structured Data for Organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Preown by applebae",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description:
    "Your trusted source for premium phones and the latest gadgets. Discover top brands, unbeatable deals, and expert support.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    areaServed: ["IN"],
    availableLanguage: ["en", "hi", "ml"],
  },
  sameAs: [
    // Add your social media profiles here
    // "https://www.facebook.com/preownbyapplebae",
    // "https://www.instagram.com/preownbyapplebae",
    // "https://twitter.com/preownbyapplebae",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressRegion: "Kerala",
  },
};

// Structured Data for WebSite
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Preown by applebae",
  url: SITE_URL,
  description: "Your trusted source for premium phones and the latest gadgets",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable}`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-2HNH4FQ2G7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2HNH4FQ2G7');
          `}
        </Script>
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <AppSnackbarProvider>
          <Header /> <main>{children}</main>
          <FooterNew />
          <WhatsAppButton />
        </AppSnackbarProvider>
      </body>
    </html>
  );
}
