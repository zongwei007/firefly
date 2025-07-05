import { build, getTokenConfig, updateToken } from '@/infrastructure/auth';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

export async function login(redirectTo: string, _prevState: string | undefined, formData: FormData) {
  'use server';

  const config = getTokenConfig();
  const username = formData.get('username');
  const password = formData.get('password');

  if (username !== config.username || password !== config.password) {
    return '用户名或密码错误';
  }

  const { token, expires } = build(username);

  const cookieStore = await cookies();
  updateToken(cookieStore, token, expires);

  redirect(redirectTo, RedirectType.replace);
}

export async function logout() {
  'use server';

  const cookieStore = await cookies();

  updateToken(cookieStore, '', new Date(0));

  redirect('/');
}
