import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Providers from '@/app/providers';

const inter = Inter({ subsets: ['latin'] });

// Configure dayjs
dayjs.extend(relativeTime);

export const metadata: Metadata = {
  title: 'Vertile',
  description: 'RAG Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="bg-main-base text-white flex h-screen">
            {children}
            <ToastContainer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
