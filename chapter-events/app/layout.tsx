import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chapter Events Registry",
  description: "All chapter events, in one filterable place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-paper text-ink font-body antialiased">
        <div className="bg-navy px-6 py-2 text-center font-mono text-[11px] uppercase tracking-widest text-gold">
          YPO Middle East / North Africa
        </div>
        {children}
      </body>
    </html>
  );
}
