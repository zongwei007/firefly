declare interface IToken {
  username: string;
  timestamp: number;
  expires: number;
}

declare type AuthenticationContext<Required extends boolean = true> = Required extends true
  ? { user: IToken }
  : { user: IToken | null };

declare type LoginRequest = {
  username: string;
  password: string;
};
