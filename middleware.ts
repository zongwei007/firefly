import { type NextRequest, NextResponse } from 'next/server';
import { getUserInfo } from './infrastructure/auth';
import getConfiguration from './infrastructure/configuration';

export default async function middleware(req: NextRequest) {
  const config = getConfiguration();
  const user = await getUserInfo(req.cookies);

  if (!user && !config.firefly.disableLogin) {
    return NextResponse.redirect(new URL(`/login?redirectTo=${req.url}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/settings/:path*'],
};
