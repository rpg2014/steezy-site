import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head >
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet"/> 
        <meta name='application-name' content='PWA App' />
          <meta name="description" content="Description" />
          <meta name="keywords" content="Keywords" />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        

        <link rel="manifest" href="/manifest.json" />
        <link
          href="favicon.ico"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/favicon.ico"
          rel="icon"
          type="image/ico"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/favicon.ico"></link>
        <meta name="theme-color" content="#317EFB" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
