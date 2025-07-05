import { fromLocation } from '../weather';

test('check-weather', async () => {
  const resp = await fromLocation('北京 北京市 昌平区');

  expect(resp).not.toBe(null);
});
