import { ThemeProvider } from './contexts/ThemeContext'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Biblical Wisdom',
  description: 'Chat with Biblical figures and explore scripture',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link 
          href="https://fonts.googleapis.com/icon?family=Material+Icons" 
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-stone-900">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
