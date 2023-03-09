import { footerConfig } from "@/config/footer";
import { Appbar } from "@/content/controls/navigation/appbar";
import { createEmotionCache } from "@/styles/index";
import { api } from "@/trpc/api";
import { avoid, avoidpaths } from "@/utils/navigation";
import { EmotionCache } from "@emotion/react";
import {
  Body,
  Content,
  Footer,
  InlineFooter,
  Shell,
  ThemeProvider,
} from "@oxygen/design-system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "intersection-observer";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { useRouter } from "next/router";
import React from "react";
import "swiper/css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const NextApp: AppType<{
  session: Session | null;
  emotionCache?: EmotionCache;
  settings?: any;
}> = ({
  Component,
  pageProps: { emotionCache = clientSideEmotionCache, session, ...pageProps },
}) => {
  const router = useRouter();
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
          },
        },
      })
  );
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider emotionCache={emotionCache}>
          <Content>
            {!avoid(router.pathname, avoidpaths) && <Appbar />}
            <Shell>
              <Body>
                <Component {...pageProps} data-application="true" />
                <ReactQueryDevtools initialIsOpen={false} />
              </Body>
            </Shell>
            {!avoid(router.pathname, avoidpaths) && (
              <InlineFooter
                isFooterAllowedOnPage={true}
                footerConfig={footerConfig}
              />
            )}
            {!avoid(router.pathname, avoidpaths) && (
              <Footer
                isFooterAllowedOnPage={true}
                footerConfig={footerConfig}
              />
            )}
          </Content>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(NextApp);
