import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import styles from './style.module.css';
import classNames from 'classnames';
import { Button } from 'components';

type LoginFormProps = {
  className?: string;
  redirectTo?: string;
};

const Login: FC<LoginFormProps> = ({ className, redirectTo = '/' }) => {
  const [error, setError] = useState<string | undefined>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await fetch('/api/token', {
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      await router.replace(redirectTo);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <form className={classNames(styles.login, className)} onSubmit={handleSubmit}>
      <h2>登录</h2>
      <div className="form-group">
        <label>用户名</label>
        <input
          type="text"
          placeholder="请输入用户名"
          value={username}
          onChange={e => {
            setError(undefined);
            setUsername(e.target.value);
          }}
          autoFocus
        />
      </div>
      <div className="form-group">
        <label>密码</label>
        <input
          type="password"
          placeholder="请输入密码"
          value={password}
          onChange={e => {
            setError(undefined);
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className={styles.formGroup}>
        {error && <summary className={styles.errorMessage}>{error}</summary>}
        <Button className={styles.submit} type="submit">
          登录
        </Button>
      </div>
    </form>
  );
};

export default Login;
