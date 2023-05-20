import '@/styles/globals.scss'
import {Montserrat} from 'next/font/google'
import {Metadata} from 'next'

const montserrat = Montserrat({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'XChat',
    description: 'Rozmawiaj online z losowymi ludźmi',
    authors: [
        {
            name: 'SzymonG110',
            url: 'https://szymon.ml/'
        }
    ],
    viewport: 'width=device-width, initial-scale=1.0'
}

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="pl-PL">
        <body className={montserrat.className}>
        {children}
        </body>
        </html>
    )
}
