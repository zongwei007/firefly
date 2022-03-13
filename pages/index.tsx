import type { HomeProps } from 'layouts/home/Home';
import Home from 'layouts/home/Home';
import type { NextPage } from 'next';
import Head from 'next/head';
import { query as queryWeather } from 'services/weather';
import * as storage from 'infrastructure/storage';
import { useGlobalStorage } from 'hooks';
import { withUserProps } from 'infrastructure/auth';

export const getServerSideProps = withUserProps(
  async () => {
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
  },
  { required: true }
);

const Index: NextPage<HomeProps & GlobalState> = ({ apps, bookmarks, ...rest }) => {
  const [Provider] = useGlobalStorage({ apps, bookmarks });

  return (
    <>
      <Head>
        <title>Firefly</title>
        <meta name="description" content="Firefly - 自托管导航页" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider>
        <Home {...rest} />
      </Provider>
    </>
  );
};

export default Index;
