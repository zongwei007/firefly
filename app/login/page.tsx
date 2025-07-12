import { login } from '@/actions/auth';
import getConfiguration from '@/infrastructure/configuration';
import LoginForm from './LoginForm';
import { notFound } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { redirectTo = '/' } = await searchParams;
  const config = getConfiguration();

  if (config.firefly.disableLogin) {
    notFound();
  }

  return <LoginForm action={login.bind(null, redirectTo)} />;
}
