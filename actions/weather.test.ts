import { test } from 'node:test';
import assert from 'node:assert';
import { fromLocation } from './weather.ts';

test('check-weather', async () => {
  const resp = await fromLocation('北京 北京市 昌平区');

  assert.ok(resp);
});
