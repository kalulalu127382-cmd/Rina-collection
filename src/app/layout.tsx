import type { Metadata } from "next";
import { Toaster } from 'sonner';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Sasto Bazar — Affordable Fashion, Biratnagar Nepal",
    template: "%s | Sasto Bazar",
  },
  description: "Discover affordable fashion at Sasto Bazar, Biratnagar Hatkhola Chowk. Shop kurtas, sarees, and modern fashion with easy QR payment and doorstep delivery across Nepal.",
  keywords: ["Sasto Bazar", "Biratnagar", "Nepal fashion", "clothing store", "kurta", "saree", "online shopping Nepal", "sasto", "affordable"],
  openGraph: {
    title: "Sasto Bazar — Affordable Fashion, Biratnagar Nepal",
    description: "Affordable fashion with doorstep delivery across Nepal.",
    type: "website",
    locale: "en_NP",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-sans)',
              borderRadius: '0.75rem',
            },
          }}
        />
      </body>
    </html>
  );
}
