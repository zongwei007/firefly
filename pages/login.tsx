// noinspection HtmlUnknownTarget

import type { NextPage } from 'next';
import Head from 'next/head';
import LoginForm from 'layouts/login/Login';
import { useRouter } from 'next/router';
import config from 'infrastructure/environment';

export async function getStaticProps() {
  return {
    props: { title: config.firefly.title },
  };
}

const Login: NextPage<{ title: string }> = ({ title }) => {
  const router = useRouter();
  const redirectTo = router.query['redirectTo'];

  return (
    <>
      <Head>
        <title>{`登录 - ${title}`}</title>
        <meta name="description" content={`${title} - 自托管导航页`} />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="page-container">
        <LoginForm redirectTo={Array.isArray(redirectTo) ? redirectTo[0] : redirectTo || '/'} />
      </div>
    </>
  );
};

export default Login;
