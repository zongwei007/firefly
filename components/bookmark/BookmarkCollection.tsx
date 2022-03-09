import { useGlobalState } from 'hooks';
import classNames from 'classnames';
import type { FC } from 'react';
import Image from 'next/image';

import styles from './style.module.css';

type BookmarkCollectionProps = {
  className?: string;
};

const BookmarkCollection: FC<BookmarkCollectionProps> = ({ className }) => {
  const { bookmarks } = useGlobalState();

  return (
    <div className={className}>
      <h2>书签</h2>
      {bookmarks.categories.map(category => (
        <div key={category.id} className={classNames(styles.group, 'pull-left')}>
          <h3 className={styles.groupTitle}>{category.title}</h3>
          <ul className={styles.list}>
            {category.links.map((link, i) => {
              return (
                <li key={`${i}_${link.name}`}>
                  <a href={link.link} target="_blank" rel="noopener noreferrer" className={styles.bookmark}>
                    <Image
                      className={styles.icon}
                      src={
                        link.icon
                          ? `/assets/mdi/${link.icon}.svg`
                          : `/api/favicon?host=${encodeURI(new URL(link.link).origin)}`
                      }
                      width={20}
                      height={20}
                    />
                    <span>{link.name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BookmarkCollection;
