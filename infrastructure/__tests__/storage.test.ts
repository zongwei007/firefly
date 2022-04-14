import { v2 as webdav } from 'webdav-server';
import type { Storage } from '../storage';
import { DiskStorage, WebdavStorage } from '../storage';
import fs from 'fs';
import path from 'path';
import os from 'os';

const APPS_EXAMPLE = `
links:
- name: 示例链接
  link: https://link.example.com
  icon: evernote
  desc: 链接描述文本`;

const diskDir: string = fs.mkdtempSync(path.resolve(os.tmpdir(), 'firefly-test'));
const webdavServerDir: string = fs.mkdtempSync(path.resolve(os.tmpdir(), 'firefly-test'));
const diskStorage: DiskStorage = new DiskStorage({ path: diskDir });
const webdavStorage: WebdavStorage = new WebdavStorage({
  host: 'http://localhost:9000',
  username: 'user',
  password: 'pass',
  authType: 'Password',
  directory: '/',
});

let webdavServer: webdav.WebDAVServer;

beforeAll(async () => {
  jest.resetModules();

  const userManager = new webdav.SimpleUserManager();
  userManager.addUser('user', 'pass', true);

  webdavServer = new webdav.WebDAVServer({
    httpAuthentication: new webdav.HTTPBasicAuthentication(userManager),
    headers: {
      'Access-Control-Allow-Headers': 'Depth, Authorization',
    },
  });

  await webdavServer.setFileSystemAsync('/', new webdav.PhysicalFileSystem(webdavServerDir));
  await webdavServer.startAsync(9000);
});

beforeEach(async () => {
  const files = fs.readdirSync(diskDir).map(ele => `${diskDir}/${ele}`);
  files.push(...fs.readdirSync(webdavServerDir).map(ele => `${webdavServerDir}/${ele}`));

  for (const file of files) {
    fs.rmSync(file);
  }
});

describe.each<[string, string, Storage]>([
  ['webdav', webdavServerDir, webdavStorage],
  ['disk', diskDir, diskStorage],
])('test %s', (_name, dir, storage) => {
  test('read', async () => {
    fs.writeFileSync(path.resolve(dir, 'apps.yml'), APPS_EXAMPLE);

    try {
      let resp = await storage.read<{ links: Array<IBookmark> }>('apps.yml');
      expect(resp).not.toBeNull();
      expect(resp!.links).toHaveLength(1);
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  test('read not exist', async () => {
    expect(await storage.read('apps.yml')).toBeNull();
  });

  test('write', async () => {
    try {
      await storage.write('apps.yml', { links: [] });

      const yml = fs.readFileSync(path.resolve(dir, 'apps.yml'), { encoding: 'utf-8' });
      expect(yml).toContain('links');
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
});

afterAll(async () => {
  await webdavServer.stopAsync();
}, 10000);
