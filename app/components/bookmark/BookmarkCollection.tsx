import classNames from 'classnames';
import Bookmark from './Bookmark';

import styles from './style.module.css';

type BookmarkCollectionProps = {
  className?: string;
  filter: string;
  value: IBookmarkConfiguration;
};

function BookmarkCollection({ className, filter, value }: BookmarkCollectionProps) {
  const { categories = [], bookmarks: bookmarkRaws = [] } = value || {};

  const bookmarks = (() => {
    if (!filter) {
      return bookmarkRaws;
    }

    const regExp = new RegExp(filter, 'i');
    return bookmarkRaws.filter(ele => [ele.name, ele.link, ele.desc ?? ''].some(txt => txt.match(regExp)));
  })();

  const group = (() => {
    if (!bookmarks) {
      return null;
    }

    return bookmarks.reduce((memo, bookmark) => {
      const key = bookmark.category || 'undefined';
      const collection = memo.get(key) || [];

      collection.push(bookmark);
      return memo.set(key, collection);
    }, new Map<ICategory['id'], Array<IBookmark>>());
  })();

  return (
    <>
      {categories
        .filter(category => group?.has(category.id))
        .map(category => (
          <div key={category.id} className={className}>
            <h2>{category.name}</h2>
            <div className={classNames('clearfix', styles.bookmarks)}>
              {group?.get(category.id)?.map((link, i) => <Bookmark key={`${i}_${link.name}`} item={link} />)}
            </div>
          </div>
        ))}
      {group?.has('undefined') && (
        <div className={className}>
          <h2>未分类</h2>
          <div className={classNames('clearfix', styles.bookmarks)}>
            {group?.get('undefined')?.map((link, i) => <Bookmark key={`${i}_${link.name}`} item={link} />)}
          </div>
        </div>
      )}
      {group?.size === 0 && filter && <div className={styles.empty}>未找到匹配的书签</div>}
    </>
  );
}

export default BookmarkCollection;
