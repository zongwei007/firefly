declare interface ErrorResponse {
  message: string;
}

declare interface GlobalConfiguration {
  firefly: {
    title: string;
    username?: string;
    password?: string;
    disableLogin: boolean;
    expire: number;
  };
  webdav: {
    host: string;
    username: string;
    password: string;
    authType: 'Digest' | 'Password';
    directory: string;
  };
}
