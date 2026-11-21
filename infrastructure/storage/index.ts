import getConfiguration from '@/infrastructure/configuration';
import { DiskStorage } from './disk';
import { UpstashRedisStorage } from './upstash-redis';
import { WebdavStorage } from './webdav';

const storage: SettingStorage = (({ storage: config }) => {
  if (config.mode === 'disk') {
    return new DiskStorage(config);
  }

  if (config.mode === 'upstash-redis') {
    return new UpstashRedisStorage(config);
  }

  return new WebdavStorage(config);
})(getConfiguration());

export default storage;
