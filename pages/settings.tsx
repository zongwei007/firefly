// noinspection HtmlUnknownTarget

import type { NextPage } from 'next';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

import { withUserProps } from 'infrastructure/auth';
import * as environment from 'infrastructure/environment';
import SettingPanel from 'layouts/setting/SettingPanel';
import type { SettingPanelProps } from 'layouts/setting/SettingPanel';

import 'react-toastify/dist/ReactToastify.css';

const { firefly: config } = environment.get();

export const getServerSideProps = withUserProps(
  async ({ user }) => {
    return {
      props: { user, title: config.title, disableLogin: config.disableLogin },
    };
  },
  { required: !config.disableLogin }
);

const Settings: NextPage<SettingPanelProps & { title: string }> = ({ title, ...props }) => {
  return (
    <>
      <Head>
        <title>{`设置 - ${title}`}</title>
        <meta name="description" content={`${title} - 自托管导航页`} />
        <link rel="preload" href="/api/bookmarks" as="fetch" crossOrigin="true" />
        <link rel="preload" href="/api/settings" as="fetch" crossOrigin="true" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <div className="page-container">
        <SettingPanel {...props} />
      </div>
      <ToastContainer autoClose={3000} />
    </>
  );
};

export default Settings;
