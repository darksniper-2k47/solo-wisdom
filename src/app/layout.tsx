import { ThemeProvider } from './contexts/ThemeContext';
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
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/icon?family=Material+Icons" 
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
