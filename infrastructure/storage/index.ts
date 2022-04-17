import config from 'infrastructure/configuration';
import { DiskStorage } from './disk';
import { WebdavStorage } from './webdav';

const storage: SettingStorage = (cfg => {
  if (cfg.mode === 'disk') {
    return new DiskStorage(cfg);
  }

  return new WebdavStorage(cfg);
})(config.storage);

export default storage;
