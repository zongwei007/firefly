import * as bookmarkAction from '@/actions/bookmark';
import * as settingAction from '@/actions/setting';
import * as weatherAction from '@/actions/weather';
import { getUserInfo } from '@/infrastructure/auth';
import getConfiguration from '@/infrastructure/configuration';
import { mdiCogOutline, mdiLoginVariant } from '@mdi/js';
import Icon from '@mdi/react';
import Link from 'next/link';
import Home from './Home';
import styles from './page.module.css';

export default async function HomePage() {
  const { firefly } = getConfiguration();
  const anonymous = (await getUserInfo()) == null;
  const setting = await settingAction.get();
  const weather = await weatherAction.fromSetting(setting.weather);
  const bookmarks = await bookmarkAction.list(anonymous);
  const now = Date.now();

  return (
    <Home setting={setting} weather={weather} bookmarks={bookmarks} now={now}>
      <div className={styles.toolbar}>
        {anonymous && !firefly.disableLogin ? (
          <Link href="/login" className={styles.icon} title="登录">
            <Icon path={mdiLoginVariant} size="30px" />
          </Link>
        ) : null}
        <Link href="/settings" className={styles.icon} title="设置">
          <Icon path={mdiCogOutline} size="30px" />
        </Link>
      </div>
    </Home>
  );
}
