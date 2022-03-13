import type { NextPage } from 'next';
import Head from 'next/head';
import LoginForm from 'layouts/login/Login';
import { useRouter } from 'next/router';

const Login: NextPage = () => {
  const router = useRouter();
  const redirectTo = router.query['redirectTo'];

  return (
    <>
      <Head>
        <title>登录 - Firefly</title>
        <meta name="description" content="Firefly - 自托管导航页" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-container">
        <LoginForm redirectTo={Array.isArray(redirectTo) ? redirectTo[0] : redirectTo || '/'} />
      </div>
    </>
  );
};

export default Login;
