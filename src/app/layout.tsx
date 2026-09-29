import type { Metadata } from "next";
import { Toaster } from 'sonner';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rina Collection — Curated Fashion, Hetauda Nepal",
    template: "%s | Rina Collection",
  },
  description: "Discover elegantly curated clothing at Rina Collection, Hetauda Bus Park. Shop kurtas, sarees, and modern fashion with easy QR payment and doorstep delivery across Nepal.",
  keywords: ["Rina Collection", "Hetauda", "Nepal fashion", "clothing store", "kurta", "saree", "online shopping Nepal"],
  openGraph: {
    title: "Rina Collection — Curated Fashion, Hetauda Nepal",
    description: "Elegantly curated clothing with doorstep delivery across Nepal.",
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
