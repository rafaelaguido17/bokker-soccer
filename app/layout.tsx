import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Barlow, Chakra_Petch } from "next/font/google";
import "./globals.css";

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Book Soccer",
  description: "Protótipo navegável do Book Soccer, app para descobrir, avaliar e acompanhar talentos do futebol.",
  icons: { icon: "/marca/book-soccer-simbolo-app.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${chakra.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
