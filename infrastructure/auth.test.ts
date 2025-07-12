import { describe, before, after, it } from 'node:test';
import assert from 'node:assert';
import { build, parse } from './auth.ts';

describe('auth', () => {
  const originalEnv = process.env;

  before(() => {
    process.env = {
      ...originalEnv,
      FIREFLY_USERNAME: 'foo',
      FIREFLY_PASSWORD: 'bar',
      DISK_PATH: '.data',
    };
  });

  after(() => {
    process.env = originalEnv;
  });

  it('should create and resolve token', async () => {
    const { token } = await build('foo');
    assert.ok(token);

    const result = await parse(token);
    assert.ok(result);
    assert.strictEqual(result?.username, 'foo');
  });
});
