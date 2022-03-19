import type { FC, FocusEventHandler, FormEventHandler } from 'react';
import { Button } from 'components';
import { useState, useCallback } from 'react';
import { queryWeather } from 'hooks';
import styles from '../style.module.css';

type WeatherProps = {
  defaultValue: ISetting['weather'];
  onChange: (data: Pick<ISetting, 'weather'>) => PromiseLike<void> | void;
};

const Weather: FC<WeatherProps> = ({ defaultValue, onChange }) => {
  const [enable, setEnable] = useState(defaultValue.enable);
  const [location, setLocation] = useState(defaultValue.location);
  const [validating, setValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleValidate: FocusEventHandler<HTMLInputElement> = useCallback(async event => {
    setValidating(true);

    try {
      await queryWeather(event.target.value);
      setLocation(event.target.value);
    } catch (e: any) {
      setErrorMessage(e.message || '请求天气信息失败');
    } finally {
      setValidating(false);
    }
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async event => {
      event.preventDefault();
      await onChange({ weather: { enable, location } });
    },
    [enable, location]
  );

  return (
    <div>
      <h2>设置天气</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>启用天气功能</label>
          <select defaultValue={String(enable)} onChange={event => setEnable(event.target.value === 'true')}>
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        </div>
        <div className="form-group">
          <label>当前地区</label>
          <input
            type="text"
            defaultValue={location}
            onChange={event => setLocation(event.target.value)}
            onBlur={handleValidate}
          />
          <div>{errorMessage}</div>
        </div>
        <div className={styles.submit}>
          <Button type="submit" disabled={validating || !!errorMessage}>
            保存修改
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Weather;
