import type { FC } from 'react';
import { useBookmarks } from 'hooks';
import classNames from 'classnames';
import { Spinner } from 'components';
import Bookmark from './Bookmark';

import styles from './style.module.css';

const FavoriteCollection: FC<{ className?: string }> = ({ className }) => {
  const { data, isLoading } = useBookmarks();

  return (
    <div className={className}>
      <h2>快速访问</h2>
      <Spinner loading={isLoading} />
      <div className={classNames('clearfix', styles.bookmarks)}>
        {data?.favorites.map((link, i) => (
          <Bookmark key={`${i}_${link.name}`} item={link} />
        ))}
      </div>
    </div>
  );
};

export default FavoriteCollection;
