import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../src/index.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

const ogTitle = 'Career Compass｜生成AIが描く、あなたの未来キャリア'
const ogDescription =
  'プロフィールと未来の外生イベントから、あなただけのキャリアシナリオを生成。予測しづらい時代に、複数の未来像で「次の一歩」を考えてみませんか。'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: ogTitle,
    template: '%s | Career Compass',
  },
  description: ogDescription,
  openGraph: {
    title: ogTitle,
    description: ogDescription,
    url: '/',
    siteName: 'Career Compass',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: ogTitle,
    description: ogDescription,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
