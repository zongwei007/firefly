// noinspection HtmlUnknownTarget

import type { HomeProps } from 'layouts/home/Home';
import Home from 'layouts/home/Home';
import type { NextPage } from 'next';
import Head from 'next/head';
import { withUserProps } from 'infrastructure/auth';
import * as environment from 'infrastructure/environment';

export const getServerSideProps = withUserProps(async ({ user }) => {
  const { firefly: config } = environment.get();

  return {
    props: {
      user,
      timestamp: Date.now(),
      disableLogin: config.disableLogin,
      title: config.title,
    },
  };
});

const Index: NextPage<HomeProps & { title: string; user: IToken }> = ({ title, user, ...props }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${title} - 自托管导航页`} />
        <link rel="preload" href={`/api/bookmarks${!user ? '?anonymous=true' : ''}`} as="fetch" crossOrigin="true" />
        <link rel="preload" href="/api/settings" as="fetch" crossOrigin="true" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-container">
        <Home {...props} anonymous={!user} />
      </div>
    </>
  );
};

export default Index;
