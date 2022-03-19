import type { HomeProps } from 'layouts/home/Home';
import Home from 'layouts/home/Home';
import type { NextPage } from 'next';
import Head from 'next/head';
import { withUserProps } from 'infrastructure/auth';

export const getServerSideProps = withUserProps(
  async () => {
    return {
      props: {
        timestamp: Date.now(),
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
        <link rel="preload" href="/api/apps" as="fetch" />
        <link rel="preload" href="/api/bookmarks" as="fetch" />
        <link rel="preload" href="/api/settings" as="fetch" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-container">
        <Home {...props} />
      </div>
    </>
  );
};

export default Index;
