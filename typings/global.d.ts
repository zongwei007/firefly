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
  storage: DiskStorageConfiguration | WebdavStorageConfiguration | UpstashRedisStorageConfiguration;
}

interface DiskStorageConfiguration {
  mode: 'disk';
  path: string;
}

interface WebdavStorageConfiguration {
  mode: 'webdav';
  host: string;
  username: string;
  password: string;
  authType: 'Digest' | 'Password';
  directory: string;
}

interface UpstashRedisStorageConfiguration {
  mode: 'upstash-redis';
  url: string;
  token: string;
  prefix: string;
}
