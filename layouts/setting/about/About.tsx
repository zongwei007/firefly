import type { FC } from 'react';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import styles from './style.module.css';
import { Button } from 'components';

const About: FC<{
  user: IToken;
  apps: IAppCollection;
  bookmarks: IBookmarkCollection;
  settings: ISetting;
}> = ({ user, apps, bookmarks, settings }) => {
  return (
    <>
      <div className={styles.status}>
        <h2>系统状态</h2>
        <dl>
          <dt>当前用户</dt>
          <dd>{user.username}</dd>
          <dt>登录时间</dt>
          <dd>{format(user.timestamp, 'PPPPpp', { locale: zhCN })}</dd>
          <dt>应用数量</dt>
          <dd>{apps.links.length}</dd>
          <dt>书签数量</dt>
          <dd>{bookmarks.categories.reduce((memo, ele) => memo + ele.links.length, 0)}</dd>
          <dt>应用版本</dt>
          <dd>{apps.lastModifiedAt ? formatISODatetime(apps.lastModifiedAt) : '无'}</dd>
          <dt>书签版本</dt>
          <dd>{bookmarks.lastModifiedAt ? formatISODatetime(bookmarks.lastModifiedAt) : '无'}</dd>
          <dt>应用设置版本</dt>
          <dd>{settings.lastModifiedAt ? formatISODatetime(settings.lastModifiedAt) : '无'}</dd>
        </dl>
        <div>
          <Button className={styles.logout} type="button" onClick={logout}>
            注销
          </Button>
        </div>
      </div>
      <hr />
      <h2>关于 Firefly</h2>
      <p>轻量、快速的个人导航页面，无数据库依赖，支持 ServerLess 部署</p>
    </>
  );
};

async function logout() {
  await fetch('/api/token', { method: 'delete' });

  location.href = '/';
}

function formatISODatetime(datetime: string) {
  return format(parseISO(datetime), 'PPPPpp', { locale: zhCN });
}

export default About;
