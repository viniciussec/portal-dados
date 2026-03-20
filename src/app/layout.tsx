import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: {
    default: "Portal de Dados — Governo do Ceará",
    template: "%s | Portal de Dados — Ceará",
  },
  description: "Sistema de Governança e Compartilhamento de Dados do Estado do Ceará — Resolução nº 01/2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${openSans.className} min-h-screen bg-slate-50 text-slate-900 flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
