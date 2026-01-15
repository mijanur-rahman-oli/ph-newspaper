import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PH Newspaper - Bangladesh News Portal',
  description: 'Your trusted source for news from all 64 districts of Bangladesh. Stay updated with breaking news, politics, sports, entertainment, and more.',
  keywords: ['Bangladesh news', 'PH Newspaper', 'breaking news', 'local news', 'district news'],
  authors: [{ name: 'PH Newspaper' }],
  openGraph: {
    title: 'PH Newspaper - Bangladesh News Portal',
    description: 'Breaking news and updates from all districts of Bangladesh',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PH Newspaper',
    description: 'Bangladesh News Portal',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}