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

  it('should create and resolve token', () => {
    const { token } = build('foo');
    assert.ok(token);

    const result = parse(token);
    assert.ok(result);
    assert.strictEqual(result?.username, 'foo');
  });
});
