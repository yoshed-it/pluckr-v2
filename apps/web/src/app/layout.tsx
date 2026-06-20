import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
import { buildPluckrThemeCss } from "@pluckr/design-system/themeTokens";

import "./globals.css";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const displayFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Pluckr v2",
  description: "Investor prototype shell for the Pluckr rebuild."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <style dangerouslySetInnerHTML={{ __html: buildPluckrThemeCss() }} />
        {children}
      </body>
    </html>
  );
}
