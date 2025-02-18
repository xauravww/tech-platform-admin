import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/authContext';
import MobileWarning from './components/MobileWarning';
import { NextDevtoolsProvider } from '@next-devtools/core';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tech Services Platform',
  description: 'Discover our comprehensive range of technical services and solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MobileWarning>
            <Navbar />
            <div style={{ maxHeight: "calc(100vh - 65px )", minHeight: "calc(100vh - 65px )" }} className='overflow-y-scroll'>
              {children}
            </div>
          </MobileWarning>
        </AuthProvider>
      </body>
    </html>
  );
}
