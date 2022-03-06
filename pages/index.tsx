import type { HomeProps } from 'layouts/home/Home';
import Home from 'layouts/home/Home';
import type { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import { query as queryWeather } from 'services/weather';
import * as storage from 'services/storage';
import { useGlobalStorage } from 'hooks';

export async function getServerSideProps(context: NextPageContext) {
  const apps = await storage.read<AppCollectionData>('apps.yml');
  const bookmarks = await storage.read<AppCollectionData>('bookmarks.yml');

  const weather = await queryWeather('北京', '北京市', '昌平区');

  return {
    props: {
      apps,
      bookmarks,
      timestamp: Date.now(),
      weather,
    },
  };
}

const Index: NextPage<HomeProps & GlobalState> = ({ apps, bookmarks, ...rest }) => {
  const [Provider] = useGlobalStorage({ apps, bookmarks });

  return (
    <>
      <Head>
        <title>Firefly</title>
        <meta name="description" content="Firefly - 自托管的个性化首页" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider>
        <Home {...rest} />
      </Provider>
    </>
  );
};

export default Index;
