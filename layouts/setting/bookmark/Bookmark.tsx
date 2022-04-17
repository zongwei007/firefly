import type { ChangeEventHandler, FC, FormEvent } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { EditableColumnType } from 'components/table';
import { Button, IconSelect, Table } from 'components';
import CategorySelect from './CategorySelect';
import { mdiPinOff, mdiPin, mdiEyeOff, mdiEye, mdiFileImport } from '@mdi/js';
import styles from '../style.module.css';
import { toast } from 'react-toastify';
import classNames from 'classnames';

type BookmarkProps = {
  defaultValue: IBookmarkCollection;
  onChange: (data: IBookmarkCollection) => Promise<void>;
  disableLogin: boolean;
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

function useBookmark(
  defaultValue: IBookmarkCollection,
  onChange: (data: IBookmarkCollection) => Promise<void>,
  disableLogin: boolean
) {
  const [categories, setCategories] = useState(defaultValue.categories);
  const [bookmarks, setBookmarks] = useState(defaultValue.bookmarks);
  const [filter, setFilter] = useState('');

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
        icon={row.pined ? mdiPinOff : mdiPin}
        onClick={() => setBookmarks(replaceItem(bookmarks, index, { ...row, pined: !row.pined }))}
        title={(row.pined ? '取消' : '设为') + '常用书签'}
      />
      {!disableLogin ? (
        <Button
          mode="circle-link"
          size="sm"
          icon={row.private ? mdiEyeOff : mdiEye}
          onClick={() => setBookmarks(replaceItem(bookmarks, index, { ...row, private: !row.private }))}
          title={(row.private ? '取消' : '设为') + '私密书签'}
        />
      ) : null}
    </>
  );

  const handleBookmarkImport: ChangeEventHandler<HTMLInputElement> = async event => {
    if (!event.target?.files?.length) {
      return;
    }

    const file = event.target.files[0];
    const html = await file.text();
    const dom = document.createElement('div');
    dom.innerHTML = html;

    const existed = new Set(bookmarks.map(ele => ele.link));
    const result = bookmarks.concat([]);

    dom.querySelectorAll('a').forEach(ele => {
      const bk = { name: ele.innerText, link: ele.href };

      if (existed.has(bk.link)) {
        return;
      }

      existed.add(bk.link);
      result.push(bk);
    });

    setBookmarks(result);
    event.target.value = '';
  };

  return {
    categories,
    bookmarks,
    filter,
    setCategories,
    setBookmarks,
    setFilter,
    handleSubmit,
    handleBookmarkOperation,
    handleBookmarkImport,
  };
}

const Bookmark: FC<BookmarkProps> = ({ defaultValue, onChange, disableLogin }) => {
  const {
    categories,
    bookmarks,
    filter,
    setCategories,
    setBookmarks,
    setFilter,
    handleSubmit,
    handleBookmarkOperation,
    handleBookmarkImport,
  } = useBookmark(defaultValue, onChange, disableLogin);

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

  const fileImportRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h2>分类管理</h2>
      <form onSubmit={event => handleSubmit(event, { ...defaultValue, categories })}>
        <Table<ICategory>
          rowKey="id"
          columns={CATEGORY_COLUMNS}
          data={categories}
          scroll={{ y: categories.length > 6 ? 256 : undefined }}
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
          rowClassName={row => (rowIsMatch(row, filter) ? styles.highlight : '')}
          scroll={{ y: bookmarks.length > 12 ? 512 : undefined }}
          columns={bookmarkColumns}
          data={bookmarks}
          onCreate={() => ({ name: '', link: '' })}
          onChange={data => setBookmarks(data)}
          operation={{ render: handleBookmarkOperation, width: disableLogin ? '7.5rem' : '9rem' }}
          toolbar={
            <>
              <Button onClick={() => fileImportRef.current && fileImportRef.current.click()} icon={mdiFileImport}>
                导入
              </Button>
              <div className={classNames('form-group', styles.bookmarkFilter)}>
                <input
                  className="sm"
                  placeholder="查询书签"
                  onChange={event => setFilter(event.target.value)}
                  value={filter}
                />
              </div>
            </>
          }
        />
        <input
          ref={fileImportRef}
          className={styles.importTrigger}
          type="file"
          accept="text/html"
          onChange={handleBookmarkImport}
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

function rowIsMatch(item: IBookmark, filter: string) {
  const regExp = filter ? new RegExp(filter, 'i') : undefined;
  return filter && [item.name, item.link, item.desc].filter(Boolean).some(txt => txt!.match(regExp!));
}

export default Bookmark;
