import type { ChangeEventHandler, FC, FormEvent } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { EditableColumnType, OperationRender } from 'components/table';
import { Button, IconSelect, Table } from 'components';
import CategorySelect from './CategorySelect';
import { mdiEye, mdiEyeOff, mdiFileImport, mdiPin, mdiPinOff } from '@mdi/js';
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

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>, result: IBookmarkCollection) => {
      event.preventDefault();

      return toast.promise(onChange(result), {
        pending: '正在保存',
        success: '保存成功',
        error: '保存失败',
      });
    },
    [onChange]
  );

  const handleBookmarkOperation: OperationRender<IBookmark> = (_value, row, index, updater) => (
    <>
      <Button
        mode="circle-link"
        size="sm"
        icon={row.pined ? mdiPinOff : mdiPin}
        onClick={() => updater(index, { ...row, pined: !row.pined }, row)}
        title={(row.pined ? '取消' : '设为') + '常用书签'}
      />
      {!disableLogin ? (
        <Button
          mode="circle-link"
          size="sm"
          icon={row.private ? mdiEyeOff : mdiEye}
          onClick={() => updater(index, { ...row, private: !row.private }, row)}
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
    setCategories,
    setBookmarks,
    handleSubmit,
    handleBookmarkOperation,
    handleBookmarkImport,
  };
}

const Bookmark: FC<BookmarkProps> = ({ defaultValue, onChange, disableLogin }) => {
  const {
    categories,
    bookmarks,
    setCategories,
    setBookmarks,
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
          className={styles.categoryTable}
          rowKey="id"
          columns={CATEGORY_COLUMNS}
          data={categories}
          scroll={{ y: categories.length > 6 ? 256 : undefined }}
          onCreate={() => ({ id: String(Date.now()), name: '' })}
          onChange={data => setCategories(data)}
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
          scroll={{ y: bookmarks.length > 12 ? 512 : undefined }}
          columns={bookmarkColumns}
          data={bookmarks}
          onCreate={() => ({ name: '', link: '' })}
          onChange={data => setBookmarks(data)}
          operation={{ render: handleBookmarkOperation, width: disableLogin ? '5rem' : '6.5rem' }}
          filter={rowIsMatch}
          toolbar={
            <Button onClick={() => fileImportRef.current?.click()} icon={mdiFileImport}>
              导入
            </Button>
          }
        />
        <div className={styles.submit}>
          <Button type="submit">保存修改</Button>
        </div>
      </form>
      <input
        ref={fileImportRef}
        className={styles.importTrigger}
        type="file"
        accept="text/html"
        onChange={handleBookmarkImport}
      />
    </div>
  );
};

function rowIsMatch(filter: string, item: IBookmark) {
  const regExp = new RegExp(filter, 'i');

  return [item.name, item.link, item.desc].filter(Boolean).some(txt => txt!.match(regExp!));
}

export default Bookmark;
