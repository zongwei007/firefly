import { describe, before, after, beforeEach, it } from 'node:test';
import assert from 'node:assert';
import { v2 as webdav } from 'webdav-server';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { DiskStorage } from './disk.ts';
import { WebdavStorage } from './webdav.ts';

const APPS_EXAMPLE = `
links:
- name: 示例链接
  link: https://link.example.com
  icon: evernote
  desc: 链接描述文本`;

describe('storage', () => {
  const diskDir: string = fs.mkdtempSync(path.resolve(os.tmpdir(), 'firefly-test'));
  const webdavServerDir: string = fs.mkdtempSync(path.resolve(os.tmpdir(), 'firefly-test'));
  const diskStorage = new DiskStorage({ mode: 'disk', path: diskDir });
  const webdavStorage = new WebdavStorage({
    mode: 'webdav',
    host: 'http://localhost:9000',
    username: 'user',
    password: 'pass',
    authType: 'Password',
    directory: '/',
  });

  let webdavServer: webdav.WebDAVServer;

  before(async () => {
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

  describe('webdav', () => {
    it('should read file', async () => {
      fs.writeFileSync(path.resolve(webdavServerDir, 'apps.yml'), APPS_EXAMPLE);

      try {
        const resp = await webdavStorage.read<{ links: Array<IBookmark> }>('apps.yml');
        assert.ok(resp);
        assert.strictEqual(resp.links.length, 1);
      } catch (e) {
        console.error(e);
        throw e;
      }
    });

    it('should return null when reading non-existent file', async () => {
      assert.strictEqual(await webdavStorage.read('apps.yml'), null);
    });

    it('should write file', async () => {
      try {
        await webdavStorage.write('apps.yml', { links: [] });

        const yml = fs.readFileSync(path.resolve(webdavServerDir, 'apps.yml'), { encoding: 'utf-8' });
        assert.ok(yml.includes('links'));
      } catch (e) {
        console.error(e);
        throw e;
      }
    });
  });

  describe('disk', () => {
    it('should read file', async () => {
      fs.writeFileSync(path.resolve(diskDir, 'apps.yml'), APPS_EXAMPLE);

      try {
        const resp = await diskStorage.read<{ links: Array<IBookmark> }>('apps.yml');
        assert.ok(resp);
        assert.strictEqual(resp.links.length, 1);
      } catch (e) {
        console.error(e);
        throw e;
      }
    });

    it('should return null when reading non-existent file', async () => {
      assert.strictEqual(await diskStorage.read('apps.yml'), null);
    });

    it('should write file', async () => {
      try {
        await diskStorage.write('apps.yml', { links: [] });

        const yml = fs.readFileSync(path.resolve(diskDir, 'apps.yml'), { encoding: 'utf-8' });
        assert.ok(yml.includes('links'));
      } catch (e) {
        console.error(e);
        throw e;
      }
    });
  });

  after(async () => {
    await webdavServer.stopAsync();
  });
});
