import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import request, { localCacheProvider } from 'infrastructure/request';
import './globals.css';

const SWR_CONFIG = {
  fetcher: request,
  provider: localCacheProvider,
};

function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={SWR_CONFIG}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default App;
