import { Button } from '@/components';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import styles from './style.module.css';

type AboutProps = {
  user: IToken | null;
  bookmarks: IBookmarkConfiguration;
  settings: ISetting;
  onLogout: () => void;
};

function About({ user, bookmarks, settings, onLogout }: AboutProps) {
  return (
    <>
      <div className={styles.status}>
        <h2>系统状态</h2>
        <dl>
          <dt>当前用户</dt>
          <dd>{user ? user.username : 'Anonymous'}</dd>
          <dt>登录时间</dt>
          <dd>{user ? format(user.timestamp, 'PPPPpp', { locale: zhCN }) : '无'}</dd>
          <dt>分类数量</dt>
          <dd>{bookmarks.categories.length}</dd>
          <dt>书签数量</dt>
          <dd>{bookmarks.bookmarks.length}</dd>
          <dt>书签版本</dt>
          <dd>{bookmarks.lastModifiedAt ? formatISODatetime(bookmarks.lastModifiedAt) : '无'}</dd>
          <dt>应用设置版本</dt>
          <dd>{settings.lastModifiedAt ? formatISODatetime(settings.lastModifiedAt) : '无'}</dd>
        </dl>
        <div>
          <Button className={styles.logout} type="button" onClick={onLogout}>
            注销
          </Button>
        </div>
      </div>
      <hr />
      <h2>关于 Firefly</h2>
      <p>轻量、快速的个人导航页面，无数据库依赖，支持 ServerLess 部署</p>
    </>
  );
}

function formatISODatetime(datetime: string) {
  return format(parseISO(datetime), 'yyyy-MM-dd hh:mm:ss');
}

export default About;
