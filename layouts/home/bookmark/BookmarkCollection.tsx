import { useBookmarks } from 'hooks';
import type { FC } from 'react';
import { FaviconIcon, Spinner } from 'components';

import styles from './style.module.css';

type BookmarkCollectionProps = {
  className?: string;
};

const BookmarkCollection: FC<BookmarkCollectionProps> = ({ className }) => {
  const { data, group, isLoading } = useBookmarks();

  return (
    <div className={className}>
      <h2>书签</h2>
      <Spinner loading={isLoading} />
      <div className={styles.groupContainer}>
        {data?.categories
          .filter(category => category.id !== 'favorite')
          .filter(category => group?.has(category.id))
          .map(category => (
            <div key={category.id} className={styles.group}>
              <h3 className={styles.groupTitle}>{category.name}</h3>
              <ul className={styles.list}>
                {group?.get(category.id)?.map((link, i) => {
                  return (
                    <li key={`${i}_${link.name}`}>
                      <a href={link.link} target="_blank" rel="noopener noreferrer" className={styles.bookmark}>
                        <FaviconIcon icon={link.icon} link={link.link} className={styles.icon} width={20} height={20} />
                        <span>{link.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BookmarkCollection;
