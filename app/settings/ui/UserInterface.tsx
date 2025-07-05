'use client';

import { toast } from 'react-toastify';
import { Button } from '@/components';
import styles from '../style.module.css';

type UIProps = {
  defaultValue: ISetting['ui'];
  onChange: (data: FormData) => Promise<void>;
  version?: string;
};

function UserInterface({ defaultValue, onChange, version }: UIProps) {
  const handleSubmit = (formData: FormData) => {
    return toast.promise(onChange(formData), {
      pending: '正在保存',
      success: '保存成功',
      error: '保存失败',
    });
  };

  return (
    <div>
      <form action={handleSubmit} key={version}>
        <h2>界面设置</h2>
        <div className="form-group">
          <label>自定义页脚</label>
          <textarea name="footer" placeholder="请输入自定义页脚" defaultValue={defaultValue.footer} rows={4} />
          <p className="help-text">如不希望展示页脚，可以将内容清空</p>
        </div>
        <h2>模块设置</h2>
        <div className="form-group">
          <label>显示时间模块</label>
          <select name="clock-enable" defaultValue={String(defaultValue.clock.enable)}>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>自定义问候语</label>
          <input
            type="text"
            name="clock-welcome"
            defaultValue={defaultValue.clock.welcome}
            placeholder="请输入自定义问候语"
          />
          <p className="help-text">
            如果你希望展示固定内容，可以输入“你好”
            <br />
            如果你希望根据时段展示不同内容，可以将多个内容用英文 ; 号进行分割，如“早上好;中午好;下午好;晚上好”
          </p>
        </div>
        <div className="form-group">
          <label>显示快速访问</label>
          <select name="favorite-enable" defaultValue={String(defaultValue.favorite.enable)}>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>在新窗口打开快速访问链接</label>
          <select name="favorite-target" defaultValue={defaultValue.favorite.target}>
            <option value="_blank">是</option>
            <option value="_self">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>显示书签列表</label>
          <select name="bookmark-enable" defaultValue={String(defaultValue.bookmark.enable)}>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>在新窗口打开书签链接</label>
          <select name="bookmark-target" defaultValue={defaultValue.bookmark.target}>
            <option value="_blank">是</option>
            <option value="_self">否</option>
          </select>
        </div>
        <div className={styles.submit}>
          <Button type="submit">保存修改</Button>
        </div>
      </form>
    </div>
  );
}

export default UserInterface;
