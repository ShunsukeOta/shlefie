import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import AuthGate from "./_components/AuthGate";
import PageTransition from "./_components/PageTransition";
import RegisterModalProvider from "./_components/RegisterModalProvider";
import LibraryProvider from "./_components/LibraryProvider";
import ServiceWorker from "./_components/ServiceWorker";
import NetworkStatusProvider from "./_components/NetworkStatusProvider";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Shelfie",
  description: "Minimal mobile-first bookshelf MVP wireframes.",
  manifest: "/manifest.webmanifest",
  themeColor: "#222222",
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/apple-touch-icon.svg",
  },
};

export const viewport = {
  themeColor: "#222222",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Shelfie" />
      </head>
      <body className={`${notoSansJp.className} ${geistMono.variable} app-root`}>
        <LibraryProvider>
          <NetworkStatusProvider>
            <RegisterModalProvider>
              <AuthGate>
                <PageTransition>{children}</PageTransition>
              </AuthGate>
            </RegisterModalProvider>
          </NetworkStatusProvider>
        </LibraryProvider>
        <ServiceWorker />
      </body>
    </html>
  );
}
