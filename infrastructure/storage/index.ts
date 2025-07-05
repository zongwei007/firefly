import getConfiguration from '@/infrastructure/configuration';
import { DiskStorage } from './disk';
import { WebdavStorage } from './webdav';

const storage: SettingStorage = (({ storage: config }) => {
  if (config.mode === 'disk') {
    return new DiskStorage(config);
  }

  return new WebdavStorage(config);
})(getConfiguration());

export default storage;
