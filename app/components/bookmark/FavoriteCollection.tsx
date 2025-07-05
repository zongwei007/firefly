import classNames from 'classnames';
import Bookmark from './Bookmark';

import styles from './style.module.css';
import { useMemo } from 'react';

type FavoriteProps = { className?: string; value: IBookmarkConfiguration };

function FavoriteCollection({ className, value: { bookmarks = [] } }: FavoriteProps) {
  const result = useMemo(() => bookmarks.filter(ele => ele.pined), [bookmarks]);

  return (
    <div className={className}>
      <h2>快速访问</h2>
      <div className={classNames('clearfix', styles.bookmarks)}>
        {result?.map((link, i) => <Bookmark key={`${i}_${link.name}`} item={link} />)}
      </div>
    </div>
  );
}

export default FavoriteCollection;
