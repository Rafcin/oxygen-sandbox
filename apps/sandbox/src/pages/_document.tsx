import { getInitColorSchemeScript } from "@mui/material/styles";
import { Global } from "@oxygen/design-system";
import Document, { Head, Html, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import { createEmotionCache } from "@/styles/index";

export default class NextDocument extends Document<any> {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="superfish" content="nofish" />
          <meta content="origin-when-cross-origin" name="referrer" />
          <meta name="google" content="notranslate" />
          <meta id="english-canonical-url" content="" />
          <meta name="twitter:widgets:csp" content="on" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />

          <meta name="application-name" content="sandbox.box" />
          <meta
            name="description"
            content="Sandbox is a webapp built to test out Oxygen and MUI"
          />

          <meta name="apple-mobile-web-app-title" content="sandbox.box" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />

          <link rel="manifest" href="/manifest.json" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/lalilulelo/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/lalilulelo/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/lalilulelo/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="/lalilulelo/favicon/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/lalilulelo/favicon/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <link rel="shortcut icon" href="/lalilulelo/favicon/favicon.ico" />
          <meta name="msapplication-TileColor" content="#222222" />
          <meta
            name="msapplication-config"
            content="/lalilulelo/favicon/browserconfig.xml"
          />
          <meta name="theme-color" content="#ffffff" />

          <Global />

          {/* Inject MUI styles first to match with the prepend: true configuration. */}
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          {getInitColorSchemeScript()}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
NextDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
