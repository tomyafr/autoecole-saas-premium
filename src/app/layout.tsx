import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AutoDrive Pro | SaaS Auto-École Premium",
  description:
    "Plateforme SaaS ultra-premium de gestion intelligente pour auto-écoles. Authentification, dashboards, plannings et paiements.",
  keywords: [
    "auto-école",
    "SaaS",
    "gestion",
    "planning",
    "conduite",
    "permis",
    "AutoDrive",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
