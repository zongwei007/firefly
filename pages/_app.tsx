import type { AppProps } from 'next/app';
import './globals.css';
import { SWRConfig } from 'swr';

const SWR_CONFIG = {
  fetcher: (resource: RequestInfo, init: RequestInit) => fetch(resource, init).then(resp => resp.json()),
};

function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={SWR_CONFIG}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default App;
