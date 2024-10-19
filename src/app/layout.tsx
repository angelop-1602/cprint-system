
import './globals.css'; // Global styles
import { ReactNode } from 'react';
import { Metadata } from 'next'; // Import Metadata if you are using it
import Layout from './components/Layout';

// Metadata (if applicable)
export const metadata: Metadata = {
  title: 'CPRINT',
  description: 'My application description',
};

// RootLayout Component
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>CPRINT</title>
        <meta name="description" content="My application description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
