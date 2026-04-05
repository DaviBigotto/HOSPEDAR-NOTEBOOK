import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/contexts/CartContext';

export const metadata: Metadata = {
  title: 'Bigot Parfums | Perfumaria Premium',
  description: 'A sua loja de perfumaria importada.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans text-stone-800 bg-[#faf9f7]">
        <CartProvider>
          <Navbar />
          <main className="min-h-screen pt-24 pb-0">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
