import type { FC } from 'react';
import { useBookmarks } from 'hooks';
import classNames from 'classnames';
import Bookmark from './Bookmark';

import styles from './style.module.css';

type BookmarkCollectionProps = {
  className?: string;
};

const BookmarkCollection: FC<BookmarkCollectionProps> = ({ className }) => {
  const { data, group } = useBookmarks();

  return (
    <>
      {data?.categories
        .filter(category => category.id !== 'favorite')
        .filter(category => group?.has(category.id))
        .map(category => (
          <div className={className}>
            <h2>{category.name}</h2>
            <div className={classNames('clearfix', styles.bookmarks)}>
              {group?.get(category.id)?.map((link, i) => (
                <Bookmark key={`${i}_${link.name}`} item={link} />
              ))}
            </div>
          </div>
        ))}
    </>
  );
};

export default BookmarkCollection;
