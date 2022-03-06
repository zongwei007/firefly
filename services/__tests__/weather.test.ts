import { query } from '../weather';

test('query-weather', async () => {
  const resp = await query('北京', '北京市', '昌平区');

  expect(resp).not.toBe(null);
});
