import type { FC } from 'react';
import { FaviconIcon } from 'components';
import styles from './style.module.css';

const Bookmark: FC<{ item: IBookmark }> = ({ item }) => {
  return (
    <div className={styles.bookmark}>
      <a className={styles.link} href={item.link} target="_blank" rel="noreferrer noopener" title={item.name}>
        <div className={styles.icon}>
          <FaviconIcon icon={item.icon} link={item.link} className={styles.icon} width={36} height={36} />
        </div>
        <div className={styles.text}>
          <p className={styles.title}>{item.name}</p>
          <p className={styles.desc}>{item.desc || item.link}</p>
        </div>
      </a>
    </div>
  );
};

export default Bookmark;
