import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="description" content="Play Pictures Connections, a daily puzzle game where you group related pictures together. Find four groups of four related images in this challenging and fun daily puzzle." />
        <meta name="keywords" content="pictures connections, daily puzzle, picture grouping game, image puzzle, daily game, picture connections game" />
        <meta name="author" content="Your Name" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Pictures Connections - Daily Picture Grouping Puzzle" />
        <meta property="og:description" content="Find four groups of four related pictures in this daily puzzle game. New challenge every day!" />
        <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
        <meta property="og:url" content="https://yourdomain.com" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pictures Connections - Daily Picture Grouping Puzzle" />
        <meta name="twitter:description" content="Find four groups of four related pictures in this daily puzzle game. New challenge every day!" />
        <meta name="twitter:image" content="https://yourdomain.com/twitter-card.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Structured Data / Schema.org */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Pictures Connections",
              "description": "A daily picture grouping puzzle game",
              "url": "https://yourdomain.com",
              "applicationCategory": "GameApplication",
              "genre": "Puzzle",
              "operatingSystem": "Web",
              "author": {
                "@type": "Person",
                "name": "Your Name"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />


      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}