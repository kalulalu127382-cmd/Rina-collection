import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
