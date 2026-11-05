import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kampala Bistro POS & Restaurant Management System',
  description: 'Enterprise restaurant point of sale, table manager, live kitchen display (KDS), inventory control, and fiscal billing system built for Group 3 (CSC 1102).',
  openGraph: {
    title: 'Kampala Bistro POS & Restaurant Management System',
    description: 'Enterprise restaurant point of sale, table manager, live kitchen display (KDS), inventory control, and fiscal billing system built for Group 3 (CSC 1102).',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kampala Bistro POS & Restaurant Management System',
    description: 'Enterprise restaurant point of sale, table manager, live kitchen display (KDS), inventory control, and fiscal billing system built for Group 3 (CSC 1102).',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-900 text-slate-100 antialiased font-sans select-none" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

