export class Exception extends Error {
  code: number;
  status: number;

  constructor(message: string, code = 400, status = 400) {
    super(message);
    this.code = code;
    this.status = status;
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
