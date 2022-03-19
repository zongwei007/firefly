import type { FC, FormEventHandler } from 'react';
import { Button } from 'components';
import { useState, useCallback } from 'react';
import styles from '../style.module.css';

type SearchProps = {
  defaultValue: ISetting['search'];
  onChange: (data: Pick<ISetting, 'search'>) => PromiseLike<void> | void;
};

const Search: FC<SearchProps> = ({ defaultValue, onChange }) => {
  const [enable, setEnable] = useState(defaultValue.enable);
  const [autoFocus, setAutoFocus] = useState(defaultValue.autoFocus);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async event => {
      event.preventDefault();
      await onChange({ search: { enable, autoFocus } });
    },
    [enable, autoFocus]
  );

  return (
    <div>
      <h2>页面搜索</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>显示搜索工具栏</label>
          <select defaultValue={String(enable)} onChange={event => setEnable(event.target.value === 'true')}>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>搜索工具栏自动获取焦点</label>
          <select defaultValue={String(autoFocus)} onChange={event => setAutoFocus(event.target.value === 'true')}>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <div className={styles.submit}>
          <Button type="submit">保存修改</Button>
        </div>
      </form>
    </div>
  );
};

export default Search;
