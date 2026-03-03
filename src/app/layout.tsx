import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B0F14",
};

export const metadata: Metadata = {
  title: "AutoDrive Pro | SaaS Auto-École Premium",
  description:
    "Plateforme SaaS ultra-premium de gestion intelligente pour auto-écoles. Authentification, dashboards, plannings et paiements.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AutoDrive",
  },
  icons: {
    icon: "/app-icon.png",
    apple: "/app-icon.png",
  },
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
      <body className={`${inter.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('theme');
                  const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = saved || system;
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
