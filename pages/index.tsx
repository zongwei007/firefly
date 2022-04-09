// noinspection HtmlUnknownTarget

import type { HomeProps } from 'layouts/home/Home';
import Home from 'layouts/home/Home';
import type { NextPage } from 'next';
import Head from 'next/head';
import { withUserProps } from 'infrastructure/auth';
import * as environment from 'infrastructure/environment';

export const getServerSideProps = withUserProps(
  async () => {
    const { firefly: config } = environment.get();

    return {
      props: {
        timestamp: Date.now(),
        title: config.title,
      },
    };
  },
  { required: true }
);

const Index: NextPage<HomeProps & { title: string }> = ({ title, ...props }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${title} - 自托管导航页`} />
        <link rel="preload" href="/api/bookmarks" as="fetch" crossOrigin="true" />
        <link rel="preload" href="/api/settings" as="fetch" crossOrigin="true" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-container">
        <Home {...props} />
      </div>
    </>
  );
};

export default Index;
