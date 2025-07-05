import { login } from '@/actions/auth';
import { getTokenConfig } from '@/infrastructure/auth';
import LoginForm from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { redirectTo = '/' } = await searchParams;
  const config = getTokenConfig();

  if (config.disabled) {
    return new Response('登录功能已禁用', {
      status: 403,
    });
  }

  return <LoginForm action={login.bind(null, redirectTo)} />;
}
