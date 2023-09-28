import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { RootLayout } from '../components/_baseLayout';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "🌱 S2S Tools",
  description: "Tools for S2S 🌱",
};

export default function RootRoot({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <RootLayout>
      {children}
    </RootLayout>
  );
}
