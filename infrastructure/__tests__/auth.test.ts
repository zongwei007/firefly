import { build, parse } from '../auth';

beforeAll(() => {
  jest.mock('../environment', () => ({
    get() {
      return {
        firefly: {
          username: 'foo',
          password: 'bar',
        },
      };
    },
  }));
});

test('create and resolve', () => {
  const { token } = build('foo');

  expect(token).not.toBeNull();

  const result = parse(token);

  expect(result).not.toBeNull();
  expect(result?.username).toBe('foo');
});
