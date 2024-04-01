import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

const mainFont = Roboto({ weight: '300', subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Portal',
    description: 'Portal',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={mainFont.className}>{children}</body>
        </html>
    );
}
