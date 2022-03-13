import { v2 as webdav } from 'webdav-server';

import { AUTH_TYPE, HOST, PASSWORD, read, USERNAME, write } from '../storage';
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
const originalEnv = process.env;

beforeAll(async () => {
  jest.resetModules();

  testTmpDir = await fs.mkdtemp(path.resolve(os.tmpdir(), 'firefly-test'), {});

  process.env[HOST] = 'http://localhost:9000';
  process.env[AUTH_TYPE] = 'Basic';
  process.env[USERNAME] = 'user';
  process.env[PASSWORD] = 'pass';

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
    const resp = await read<{ links: Array<Bookmark> }>('apps.yml');

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

  process.env[HOST] = originalEnv[HOST];
  process.env[USERNAME] = originalEnv[USERNAME];
  process.env[PASSWORD] = originalEnv[PASSWORD];
}, 10000);
