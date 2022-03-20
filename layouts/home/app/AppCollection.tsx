import type { FC } from 'react';
import { useBookmarks } from 'hooks';
import classNames from 'classnames';
import { FaviconIcon, Spinner } from 'components';

import styles from './style.module.css';

type AppCollectionProps = {
  className?: string;
};

const AppCollection: FC<AppCollectionProps> = ({ className }) => {
  const { data, isLoading } = useBookmarks();

  return (
    <div className={className}>
      <h2>应用</h2>
      <div className={classNames('clearfix', styles.apps)}>
        <Spinner loading={isLoading} />
        {data?.favorites.map((link, i) => (
          <div className={styles.app} key={`${i}_${link.name}`}>
            <a className={styles.link} href={link.link} target="_blank" rel="noreferrer noopener" title={link.name}>
              <div className={styles.icon}>
                <FaviconIcon icon={link.icon} link={link.link} className={styles.icon} width={35} height={35} />
              </div>
              <div className={styles.text}>
                <p className={styles.title}>{link.name}</p>
                <p className={styles.desc}>{link.desc || link.link}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppCollection;
