import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RExchange — Campus Peer Exchange',
  description: 'Campus marketplace for textbooks, notes, skills, and gear.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">{children}</body>
    </html>
  );
}