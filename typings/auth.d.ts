declare interface IToken {
  username: string;
  timestamp: Date;
  expires: Date;
}

declare type AuthenticationContext<Required extends boolean = true> = Required extends true
  ? { user: IToken }
  : { user: IToken | null };

declare type LoginRequest = {
  username: string;
  password: string;
};

declare type TokenConfig = {
  disabled: boolean;
  username?: string;
  password?: string;
  /** token 过期时间，单位为秒 */
  expire: number;
  securityKey: Buffer;
  initVector: Buffer;
};
