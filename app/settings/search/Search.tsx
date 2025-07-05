'use client';

import { toast } from 'react-toastify';
import { Button } from '@/components';
import styles from '../style.module.css';

type SearchProps = {
  defaultValue: ISetting['search'];
  onChange: (data: FormData) => Promise<void>;
  version?: string;
};

function Search({ defaultValue, onChange, version }: SearchProps) {
  const handleSubmit = (formData: FormData) => {
    return toast.promise(onChange(formData), {
      pending: '正在保存',
      success: '保存成功',
      error: '保存失败',
    });
  };

  return (
    <div>
      <h2>页面搜索</h2>
      <form action={handleSubmit} key={version}>
        <div className="form-group">
          <label>显示搜索工具栏</label>
          <select name="enable" defaultValue={String(defaultValue.enable)}>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>搜索工具栏自动获取焦点</label>
          <select name="auto-focus" defaultValue={String(defaultValue.autoFocus)}>
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
}

export default Search;
