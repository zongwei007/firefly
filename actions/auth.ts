import { build, updateToken } from '@/infrastructure/auth';
import getConfiguration from '@/infrastructure/configuration';
import { cookies } from 'next/headers';
import { redirect, RedirectType } from 'next/navigation';

export async function login(redirectTo: string, _prevState: string | undefined, formData: FormData) {
  'use server';

  const { firefly } = getConfiguration();
  const username = formData.get('username');
  const password = formData.get('password');

  if (username !== firefly.username || password !== firefly.password) {
    return '用户名或密码错误';
  }

  const { token, expires } = await build(username);

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
