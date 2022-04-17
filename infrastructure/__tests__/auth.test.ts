import { build, parse } from '../auth';

const originalEnv = process.env;

beforeAll(() => {
  process.env = {
    ...originalEnv,
    FIREFLY_USERNAME: 'foo',
    FIREFLY_PASSWORD: 'bar',
    DISK_PATH: '.data',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

test('create and resolve', () => {
  const { token } = build('foo');

  expect(token).not.toBeNull();

  const result = parse(token);

  expect(result).not.toBeNull();
  expect(result?.username).toBe('foo');
});
