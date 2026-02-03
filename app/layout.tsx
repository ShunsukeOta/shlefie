import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import PageTransition from "./_components/PageTransition";
import RegisterModalProvider from "./_components/RegisterModalProvider";
import LibraryProvider from "./_components/LibraryProvider";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJp.className} ${geistMono.variable} app-root`}>
        <LibraryProvider>
          <RegisterModalProvider>
            <PageTransition>{children}</PageTransition>
          </RegisterModalProvider>
        </LibraryProvider>
      </body>
    </html>
  );
}
