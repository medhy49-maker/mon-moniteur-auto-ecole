import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mon Moniteur Auto-École - Plateforme de Formation à la Conduite',
  description: 'Connectez moniteurs, auto-écoles, élèves et centres de formation. Plateforme française dédiée à l\'enseignement de la conduite.',
  keywords: ['auto-école', 'moniteur', 'conduite', 'permis', 'formation', 'france'],
  authors: [{ name: 'Mon Moniteur Auto-École' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    title: 'Mon Moniteur Auto-École',
    description: 'Plateforme française connectant moniteurs, auto-écoles, élèves et centres de formation',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
