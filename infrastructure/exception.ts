import { NextApiRequest, NextApiResponse } from 'next';

export class Exception extends Error {
  code: number;
  status: number;

  constructor(message: string, code = 400, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export class UnsupportedMethodException extends Exception {
  constructor(method = 'GET') {
    super(`Method ${method} is unsupported`);
  }
}

export class UnauthenticatedException extends Exception {
  constructor() {
    super('unauthenticated', 401, 401);
  }
}

export class ForbiddenException extends Exception {
  constructor(message = 'forbidden') {
    super('forbidden', 403, 403);
  }
}

export class UnknownException extends Exception {
  constructor(message: string) {
    super(message, 500, 500);
  }
}

export function withExceptionWrapper(next: (req: NextApiRequest, resp: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, resp: NextApiResponse) => {
    try {
      await next(req, resp);
    } catch (e) {
      if (e instanceof Exception) {
        if (e.status === 500) {
          console.error(e);
        }

        resp.status(e.status).json({ code: e.code, message: e.message });
        resp.end();
        return;
      }

      throw e;
    }
  };
}
