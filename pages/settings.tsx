import type { NextPage } from 'next';
import Head from 'next/head';
import { withUserProps } from 'infrastructure/auth';
import SettingPanel from 'layouts/setting/SettingPanel';
import type { SettingPanelProps } from 'layouts/setting/SettingPanel';

export const getServerSideProps = withUserProps(
  async ({ user }) => {
    return {
      props: { user },
    };
  },
  { required: true }
);

const Settings: NextPage<SettingPanelProps> = props => {
  return (
    <>
      <Head>
        <title>设置 - Firefly</title>
        <meta name="description" content="Firefly - 自托管导航页" />
        <link rel="preload" href="/api/apps" as="fetch" />
        <link rel="preload" href="/api/bookmarks" as="fetch" />
        <link rel="preload" href="/api/settings" as="fetch" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="page-container">
        <SettingPanel {...props} />
      </div>
    </>
  );
};

export default Settings;
