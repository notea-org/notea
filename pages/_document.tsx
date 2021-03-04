import Document, { Html, Head, Main, NextScript } from 'next/document'
class MyDocument extends Document {
  render() {
    return (
      <Html className="nightwind overflow-hidden">
        <Head />
        <body id="notea">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
