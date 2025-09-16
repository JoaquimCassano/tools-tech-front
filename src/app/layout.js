import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// app/layout.js (Next.js 13+ com App Router)
export const metadata = {
  title: "OCR Online Grátis | Converta Imagens em Texto",
  description:
    "Ferramenta de OCR grátis online: extraia texto de imagens ou PDFs de forma rápida e simples.",
  keywords: [
    "OCR online",
    "extrair texto de imagem",
    "converter PDF em texto",
    "OCR grátis",
  ],
  openGraph: {
    title: "OCR Online Grátis",
    description:
      "Extraia texto de imagens com nossa ferramenta de OCR gratuita.",
    url: "https://seudominio.com",
    siteName: "OCR Online",
    images: [
      {
        url: "https://ocr.joaquimcassano.com.br/preview.png", // uma imagem preview da sua página
        width: 2864,
        height: 1532,
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-900`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
