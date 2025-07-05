'use client';

import { fromLocation } from '@/actions/weather';
import { Button } from '@/components';
import type { FocusEventHandler } from 'react';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../style.module.css';

type WeatherProps = {
  defaultValue: ISetting['weather'];
  onChange: (data: FormData) => Promise<void>;
  version?: string;
};

function Weather({ defaultValue, onChange, version }: WeatherProps) {
  const [validating, setValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleValidate: FocusEventHandler<HTMLInputElement> = useCallback(async event => {
    setValidating(true);

    try {
      await fromLocation(event.target.value);
    } catch (e: unknown) {
      setErrorMessage((e as { message?: string }).message || '请求天气信息失败');
    } finally {
      setValidating(false);
    }
  }, []);

  const handleSubmit = (formData: FormData) => {
    return toast.promise(onChange(formData), {
      pending: '正在保存',
      success: '保存成功',
      error: '保存失败',
    });
  };

  return (
    <div>
      <h2>设置天气</h2>
      <form action={handleSubmit} key={version}>
        <div className="form-group">
          <label>启用天气功能</label>
          <select name="enable" defaultValue={String(defaultValue.enable)}>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>当前地区</label>
          <input name="location" type="text" defaultValue={defaultValue.location} onBlur={handleValidate} />
          <p className="help-text">
            <span>使用中文输入行政区划信息，支持设置二级或三级区划，各级间以空格分隔。</span>
            {errorMessage && <br />}
            <span className="help-text-danger">{errorMessage}</span>
          </p>
        </div>
        <div className={styles.submit}>
          <Button type="submit" disabled={validating || !!errorMessage}>
            保存修改
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Weather;
