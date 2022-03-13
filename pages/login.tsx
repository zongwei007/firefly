import type { NextPage } from 'next';
import Head from 'next/head';
import LoginForm from 'layouts/login/Login';

const Login: NextPage = () => {
  const search = new URLSearchParams(location.search);

  return (
    <>
      <Head>
        <title>Login - Firefly</title>
        <meta name="description" content="Firefly - 自托管导航页" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-container">
        <LoginForm redirectTo={search.get('redirectTo') || '/'} />
      </div>
    </>
  );
};

export default Login;
