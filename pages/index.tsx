import type { HomeProps } from 'layouts/home/Home';
import Home from 'layouts/home/Home';
import type { NextPage } from 'next';
import Head from 'next/head';
import { query as queryWeather } from 'services/weather';
import { withUserProps } from 'infrastructure/auth';
import { SWRConfig } from 'swr';

const SWR_CONFIG = {
  fetcher: (resource: RequestInfo, init: RequestInit) => fetch(resource, init).then(resp => resp.json()),
};

export const getServerSideProps = withUserProps(
  async () => {
    const weather = await queryWeather('北京', '北京市', '昌平区');

    return {
      props: {
        timestamp: Date.now(),
        weather,
      },
    };
  },
  { required: true }
);

const Index: NextPage<HomeProps> = props => {
  return (
    <>
      <Head>
        <title>Firefly</title>
        <meta name="description" content="Firefly - 自托管导航页" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SWRConfig value={SWR_CONFIG}>
        <Home {...props} />
      </SWRConfig>
    </>
  );
};

export default Index;
