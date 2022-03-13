import { useBookmarks } from 'hooks';
import classNames from 'classnames';
import type { FC } from 'react';
import { FaviconIcon, Spinner } from 'components';

import styles from './style.module.css';

type BookmarkCollectionProps = {
  className?: string;
};

const BookmarkCollection: FC<BookmarkCollectionProps> = ({ className }) => {
  const { data, isLoading } = useBookmarks();

  return (
    <div className={className}>
      <h2>书签</h2>
      <Spinner loading={isLoading} />
      {data?.categories.map(category => (
        <div key={category.id} className={classNames(styles.group, 'pull-left')}>
          <h3 className={styles.groupTitle}>{category.title}</h3>
          <ul className={styles.list}>
            {category.links.map((link, i) => {
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
  );
};

export default BookmarkCollection;
