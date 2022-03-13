import { build, parse, USERNAME, PASSWORD } from '../auth';

const originalEnv = process.env;

beforeAll(() => {
  process.env[USERNAME] = 'foo';
  process.env[PASSWORD] = 'bar';
});

afterAll(() => {
  process.env[USERNAME] = originalEnv[USERNAME];
  process.env[PASSWORD] = originalEnv[PASSWORD];
});

test('create and resolve', () => {
  const u = process.env[USERNAME]!;

  const { token } = build(u);

  expect(token).not.toBeNull();

  const result = parse(token);

  expect(result).not.toBeNull();
  expect(result?.username).toBe(u);
});
