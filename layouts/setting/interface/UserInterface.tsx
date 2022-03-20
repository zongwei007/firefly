import type { FC, FormEventHandler } from 'react';
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'components';
import styles from '../style.module.css';

type UIProps = {
  defaultValue: ISetting['ui'];
  onChange: (data: Pick<ISetting, 'ui'>) => Promise<void>;
};

const UserInterface: FC<UIProps> = ({ defaultValue, onChange }) => {
  const [title, setTitle] = useState(defaultValue.title);
  const [footer, setFooter] = useState(defaultValue.footer);
  const [clockCfg, setClockCfg] = useState(defaultValue.clock);
  const [favoriteCfg, setFavoriteCfg] = useState(defaultValue.favorite);
  const [bookmarkCfg, setBookmarkCfg] = useState(defaultValue.bookmark);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    event => {
      event.preventDefault();
      return toast.promise(onChange({ ui: { title, footer, clock: clockCfg, favorite: favoriteCfg, bookmark: bookmarkCfg } }), {
        pending: '正在保存',
        success: '保存成功',
        error: '保存失败',
      });
    },
    [title, footer, clockCfg, favoriteCfg, bookmarkCfg]
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>界面设置</h2>
        <div className="form-group">
          <label>自定义标题</label>
          <input
            type="text"
            defaultValue={title}
            placeholder="请输入自定义标题"
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div className="form-group">
          <label>自定义页脚</label>
          <textarea
            placeholder="请输入自定义页脚"
            defaultValue={footer}
            rows={4}
            onChange={event => setFooter(event.target.value)}
          />
          <p className="help-text">如不希望展示页脚，可以将内容清空</p>
        </div>
        <h2>模块设置</h2>
        <div className="form-group">
          <label>显示时间模块</label>
          <select
            defaultValue={String(clockCfg.enable)}
            onChange={event => setClockCfg({ ...clockCfg, enable: event.target.value === 'true' })}>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>自定义问候语</label>
          <input
            type="text"
            defaultValue={clockCfg.welcome}
            placeholder="请输入自定义问候语"
            onChange={event => setClockCfg({ ...clockCfg, welcome: event.target.value })}
          />
          <p className="help-text">
            如果你希望展示固定内容，可以输入“你好”
            <br />
            如果你希望根据时段展示不同内容，可以将多个内容用英文 ; 号进行分割，如“早上好;中午好;下午好;晚上好”
          </p>
        </div>
        <div className="form-group">
          <label>显示置顶书签</label>
          <select
            defaultValue={String(favoriteCfg.enable)}
            onChange={event => setFavoriteCfg({ ...favoriteCfg, enable: event.target.value === 'true' })}>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>在新窗口打开置顶链接</label>
          <select defaultValue={favoriteCfg.target} onChange={event => setFavoriteCfg({ ...favoriteCfg, target: event.target.value })}>
            <option value="_blank">是</option>
            <option value="_self">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>显示书签模块</label>
          <select
            defaultValue={String(bookmarkCfg.enable)}
            onChange={event => setBookmarkCfg({ ...bookmarkCfg, enable: event.target.value === 'true' })}>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>在新窗口打开书签链接</label>
          <select
            defaultValue={bookmarkCfg.target}
            onChange={event => setBookmarkCfg({ ...bookmarkCfg, target: event.target.value })}>
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
};

export default UserInterface;
