import { NextResponse } from 'next/server';
import { Exception } from 'infrastructure/exception';

export function middleware() {
  try {
    return NextResponse.next();
  } catch (e: any) {
    if (e instanceof Exception) {
      if (e.status === 500) {
        console.error(e);
      }

      return new Response(JSON.stringify({ code: e.code, message: e.message }), {
        status: e.status,
        headers: {
          'Content-Type': 'application.json',
        },
      });
    }

    throw e;
  }
}
