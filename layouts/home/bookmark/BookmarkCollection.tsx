import type { FC } from 'react';
import { useBookmarks } from 'hooks';
import classNames from 'classnames';
import Bookmark from './Bookmark';

import styles from './style.module.css';

type BookmarkCollectionProps = {
  className?: string;
  filter: string;
  anonymous: boolean;
};

const BookmarkCollection: FC<BookmarkCollectionProps> = ({ className, filter, anonymous }) => {
  const { data, group } = useBookmarks(anonymous, filter);
  const { categories } = data;

  return (
    <>
      {categories
        .filter(category => group?.has(category.id))
        .map(category => (
          <div key={category.id} className={className}>
            <h2>{category.name}</h2>
            <div className={classNames('clearfix', styles.bookmarks)}>
              {group?.get(category.id)?.map((link, i) => (
                <Bookmark key={`${i}_${link.name}`} item={link} />
              ))}
            </div>
          </div>
        ))}
      {group?.has('undefined') && (
        <div className={className}>
          <h2>未分类</h2>
          <div className={classNames('clearfix', styles.bookmarks)}>
            {group?.get('undefined')?.map((link, i) => (
              <Bookmark key={`${i}_${link.name}`} item={link} />
            ))}
          </div>
        </div>
      )}
      {group?.size === 0 && filter && <div className={styles.empty}>未找到匹配的书签</div>}
    </>
  );
};

export default BookmarkCollection;
