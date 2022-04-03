import type { FC, FormEvent } from 'react';
import type { EditableColumnType } from 'components/table/Table';
import { useCallback, useMemo, useState } from 'react';
import styles from '../style.module.css';
import { Button, Table } from 'components';
import { toast } from 'react-toastify';

type BookmarkProps = {
  defaultValue: IBookmarkCollection;
  onChange: (data: IBookmarkCollection) => Promise<void>;
};

const CATEGORY_COLUMNS = [{ title: '分类名称', dataIndex: 'name' }];

const Bookmark: FC<BookmarkProps> = ({ defaultValue, onChange }) => {
  const [categories, setCategories] = useState(defaultValue.categories);
  const [bookmarks, setBookmarks] = useState(defaultValue.bookmarks);

  const CategorySelect: FC = useCallback(
    props => (
      <select {...props} autoFocus>
        <option>未选择</option>
        {categories.map(ele => (
          <option key={ele.id} value={ele.id}>
            {ele.name}
          </option>
        ))}
      </select>
    ),
    [categories]
  );

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
        component: CategorySelect,
        render: (val: string) => categoryMapping[val],
      },
      { title: '自定义图标', dataIndex: 'icon', width: '7rem' },
      { title: '描述', dataIndex: 'desc', ellipsis: true },
    ],
    [categoryMapping, CategorySelect]
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

  return (
    <div>
      <h2>分类管理</h2>
      <form onSubmit={event => handleSubmit(event, { ...defaultValue, categories })}>
        <Table<ICategory>
          rowKey="id"
          columns={CATEGORY_COLUMNS}
          data={categories}
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
          columns={bookmarkColumns}
          data={bookmarks}
          onCreate={() => ({ name: '', link: '' })}
          onChange={data => setBookmarks(data)}
        />
        <div className={styles.submit}>
          <Button type="submit">保存修改</Button>
        </div>
      </form>
    </div>
  );
};

export default Bookmark;
