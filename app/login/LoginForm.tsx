'use client';

import classNames from 'classnames';
import styles from './page.module.css';
import Button from '@/components/button/Button';
import { useActionState } from 'react';

interface LoginFormProps {
  action: (initialState: string | undefined, formData: FormData) => Promise<string | undefined>;
  error?: string;
  className?: string;
}

export default function LoginForm({ action, className }: LoginFormProps) {
  const [message, formAction] = useActionState(action, undefined);

  return (
    <form className={classNames(styles.login, className)} action={formAction}>
      <h2>登录</h2>
      <div className="form-group">
        <label>用户名</label>
        <input name="username" type="text" placeholder="请输入用户名" autoFocus />
      </div>
      <div className="form-group">
        <label>密码</label>
        <input name="password" type="password" placeholder="请输入密码" />
      </div>
      <div className={styles.formGroup}>
        {message && <summary className={styles.errorMessage}>{message}</summary>}
        <Button className={styles.submit} type="submit">
          登录
        </Button>
      </div>
    </form>
  );
}
