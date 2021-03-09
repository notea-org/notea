import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html className="nightwind">
        <Head>
          <meta name="application-name" content="Notea" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="Notea" />
          <meta
            name="description"
            content="Self hosted note taking app stored on Amazon S3 or like."
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#ffffff" />

          <link
            rel="apple-touch-icon"
            sizes="192x192"
            href="/static/icons/icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="128x128"
            href="/static/icons/icon-128x128.png"
          />
          <link rel="manifest" href="/static/manifest.json" />
        </Head>
        <body className="overflow-hidden">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
