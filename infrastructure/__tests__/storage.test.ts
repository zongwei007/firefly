import { v2 as webdav } from 'webdav-server';

jest.mock('infrastructure/environment', () => ({
  get() {
    return {
      webdav: {
        host: 'http://localhost:9000',
        username: 'user',
        password: 'pass',
        authType: 'Basic',
        directory: '/',
      },
    };
  },
}));

import { read, write } from '../storage';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const APPS_EXAMPLE = `
links:
- name: 示例链接
  link: https://link.example.com
  icon: evernote
  desc: 链接描述文本`;

let testTmpDir: string;
let webdavServer: webdav.WebDAVServer;

beforeAll(async () => {
  jest.resetModules();

  testTmpDir = await fs.mkdtemp(path.resolve(os.tmpdir(), 'firefly-test'), {});

  const userManager = new webdav.SimpleUserManager();
  userManager.addUser('user', 'pass', true);

  webdavServer = new webdav.WebDAVServer({
    httpAuthentication: new webdav.HTTPBasicAuthentication(userManager),
    headers: {
      'Access-Control-Allow-Headers': 'Depth, Authorization',
    },
  });

  await webdavServer.setFileSystemAsync('/', new webdav.PhysicalFileSystem(testTmpDir));
  await webdavServer.startAsync(9000);
});

test('read', async () => {
  const apps = path.resolve(testTmpDir, 'apps.yml');
  await fs.writeFile(apps, APPS_EXAMPLE);

  try {
    const resp = await read<{ links: Array<IBookmark> }>('apps.yml');

    expect(resp).not.toBeNull();
    expect(resp!.links).toHaveLength(1);
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await fs.rm(apps);
  }
});

test('read not exist', async () => {
  const resp = await read('apps.yml');

  expect(resp).toBeNull();
});

test('write', async () => {
  const apps = path.resolve(testTmpDir, 'apps.yml');

  try {
    await write('apps.yml', { links: [] });

    const yml = await fs.readFile(apps, { encoding: 'utf-8' });
    expect(yml).toContain('links');
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await fs.rm(apps);
  }
});

afterAll(async () => {
  await webdavServer.stopAsync();
}, 10000);
