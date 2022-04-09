import type { FC, FormEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import type { EditableColumnType } from 'components/table';
import { Button, IconSelect, Table } from 'components';
import CategorySelect from './CategorySelect';
import styles from '../style.module.css';
import { toast } from 'react-toastify';
import classNames from 'classnames';

type BookmarkProps = {
  defaultValue: IBookmarkCollection;
  onChange: (data: IBookmarkCollection) => Promise<void>;
};

const CATEGORY_COLUMNS = [{ title: '分类名称', dataIndex: 'name' }];

const IconSelectColumn: FC<{ className?: string }> = ({ className, ...props }) => {
  return (
    <IconSelect
      {...props}
      className={classNames(className, styles.iconSelect)}
      autoFocus
      defaultOpen
      placeholder="请选择图标"
      column={8}
    />
  );
};

const Bookmark: FC<BookmarkProps> = ({ defaultValue, onChange }) => {
  const [categories, setCategories] = useState(defaultValue.categories);
  const [bookmarks, setBookmarks] = useState(defaultValue.bookmarks);
  const [filter, setFilter] = useState('');

  const categoryMapping: Record<string, string> = useMemo(
    () => categories.reduce((memo, ele) => ({ ...memo, [ele.id]: ele.name }), {}),
    [categories]
  );

  const bookmarkColumns: EditableColumnType<IBookmark>[] = useMemo(
    () => [
      { title: '名称', dataIndex: 'name', width: '8rem' },
      { title: '地址', dataIndex: 'link', width: '16rem', ellipsis: true },
      {
        title: '分类',
        dataIndex: 'category',
        width: '8rem',
        component: props => <CategorySelect {...props} autoFocus />,
        render: (val: string) => categoryMapping[val],
      },
      { title: '自定义图标', dataIndex: 'icon', width: '15rem', component: IconSelectColumn },
      { title: '描述', dataIndex: 'desc', ellipsis: true },
    ],
    [categoryMapping]
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>, result: IBookmarkCollection) => {
      event.preventDefault();

      return toast.promise(onChange(result), {
        pending: '正在保存',
        success: '保存成功',
        error: '保存失败',
      });
    },
    [defaultValue]
  );

  const handleBookmarkOperation = (_value: any, row: IBookmark, index: number) => (
    <>
      <Button
        mode="circle-link"
        size="sm"
        icon={row.pined ? 'pin-off' : 'pin'}
        onClick={() => setBookmarks(replaceItem(bookmarks, index, { ...row, pined: !row.pined }))}
        title={(row.pined ? '取消' : '设为') + '常用书签'}
      />
      <Button
        mode="circle-link"
        size="sm"
        icon={row.private ? 'eye-off' : 'eye'}
        onClick={() => setBookmarks(replaceItem(bookmarks, index, { ...row, private: !row.private }))}
        title={(row.private ? '取消' : '设为') + '私密书签'}
      />
    </>
  );

  return (
    <div>
      <h2>分类管理</h2>
      <form onSubmit={event => handleSubmit(event, { ...defaultValue, categories })}>
        <Table<ICategory>
          rowKey="id"
          columns={CATEGORY_COLUMNS}
          data={categories}
          scroll={{ y: categories.length > 5 ? 256 : undefined }}
          onCreate={() => ({ id: String(Date.now()), name: '' })}
          onChange={data => setCategories(data)}
          style={{ width: '45%' }}
        />
        <div className={styles.submit}>
          <Button type="submit">保存修改</Button>
        </div>
      </form>
      <hr />
      <h2>书签管理</h2>
      <form onSubmit={event => handleSubmit(event, { ...defaultValue, bookmarks })}>
        <Table<IBookmark>
          rowKey={(row, idx) => (row.link ? row.link : String(idx))}
          rowClassName={row =>
            filter &&
            (row.name.includes(filter) || row.link.includes(filter) || row.desc?.includes(filter)
              ? styles.highlight
              : '')
          }
          scroll={{ y: bookmarks.length > 10 ? 512 : undefined }}
          columns={bookmarkColumns}
          data={bookmarks}
          onCreate={() => ({ name: '', link: '' })}
          onChange={data => setBookmarks(data)}
          operation={{ render: handleBookmarkOperation, width: '9rem' }}
          toolbar={
            <div className={classNames('form-group', styles.bookmarkFilter)}>
              <input
                className="sm"
                placeholder="查询书签"
                onChange={event => setFilter(event.target.value)}
                value={filter}
              />
            </div>
          }
        />
        <div className={styles.submit}>
          <Button type="submit">保存修改</Button>
        </div>
      </form>
    </div>
  );
};

function replaceItem<T>(array: Array<T>, index: number, item: T) {
  const result = array.concat([]);
  result.splice(index, 1, item);
  return result;
}

export default Bookmark;
