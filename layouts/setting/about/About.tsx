import type { FC } from 'react';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import styles from './style.module.css';
import { Button } from 'components';

const About: FC<{ user: IToken; apps: AppCollectionData; bookmarks: BookmarkCollectionData }> = ({
  user,
  apps,
  bookmarks,
}) => {
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
          <dt>应用最后更新时间</dt>
          <dd>{apps.lastModifiedAt ? format(parseISO(apps.lastModifiedAt), 'PPPPpp', { locale: zhCN }) : '无'}</dd>
          <dt>书签数量</dt>
          <dd>{bookmarks.categories.reduce((memo, ele) => memo + ele.links.length, 0)}</dd>
          <dt>书签最后更新时间</dt>
          <dd>
            {bookmarks.lastModifiedAt ? format(parseISO(bookmarks.lastModifiedAt), 'PPPPpp', { locale: zhCN }) : '无'}
          </dd>
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

export default About;
