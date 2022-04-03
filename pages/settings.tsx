// noinspection HtmlUnknownTarget

import type { NextPage } from 'next';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';

import { withUserProps } from 'infrastructure/auth';
import * as environment from 'infrastructure/environment';
import SettingPanel from 'layouts/setting/SettingPanel';
import type { SettingPanelProps } from 'layouts/setting/SettingPanel';

import 'react-toastify/dist/ReactToastify.css';

export const getServerSideProps = withUserProps(
  async ({ user }) => {
    const { firefly: config } = environment.get();

    return {
      props: { user, title: config.title },
    };
  },
  { required: true }
);

const Settings: NextPage<SettingPanelProps & { title: string }> = ({ title, ...props }) => {
  return (
    <>
      <Head>
        <title>{`设置 - ${title}`}</title>
        <meta name="description" content={`${title} - 自托管导航页`} />
        <link rel="preload" href="/api/bookmarks" as="fetch" />
        <link rel="preload" href="/api/settings" as="fetch" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-container">
        <SettingPanel {...props} />
      </div>
      <ToastContainer autoClose={3000} />
    </>
  );
};

export default Settings;
