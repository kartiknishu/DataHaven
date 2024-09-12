import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'InfoNest',
    description: 'University resource portal',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <link rel="icon" href="informatica.png" />
            <body className={inter.className}>{children}</body>
            <Toaster />
        </html>
    )
}
