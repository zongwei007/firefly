import type { FC } from 'react';
import { useGlobalState } from 'hooks';
import classNames from 'classnames';
import Image from 'next/image';

import styles from './style.module.css';

type AppCollectionProps = {
  className?: string;
};

const AppCollection: FC<AppCollectionProps> = ({ className }) => {
  const { apps } = useGlobalState();

  return (
    <div className={className}>
      <h2>应用</h2>
      <div className={classNames('clearfix', styles.apps)}>
        {apps.links.map((link, i) => (
          <div className={styles.app} key={`${i}_${link.name}`}>
            <a className={styles.link} href={link.link} target="_blank" rel="noreferrer noopener" title={link.name}>
              <div className={styles.icon}>
                <Image
                  src={
                    link.icon
                      ? `/assets/mdi/${link.icon}.svg`
                      : `/api/favicon?host=${encodeURI(new URL(link.link).origin)}`
                  }
                  width={35}
                  height={35}
                />
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
