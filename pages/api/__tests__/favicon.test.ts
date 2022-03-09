import handler from '../favicon';
import fetchMock from 'jest-fetch-mock';
import {  createRequest, createResponse } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

beforeAll(() => {
  fetchMock.enableMocks();
});

beforeEach(() => {
  fetchMock.resetMocks();
})

afterAll(() => {
  fetchMock.disableMocks();
});

test('resolve icon', async () => {
  fetchMock.mockIf(/foobar\.com/, async req => {
    if (req.url.endsWith('.svg')) {
      return '<svg>foobar</svg>';
    }

    return `

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title data-react-helmet="true">jest-fetch-mock - npm</title>
    <link data-react-helmet="true" rel="icon" type="image/svg" href="https://foobar.com/b0f1a8318363185cc2ea6a40ac23eeb2.svg" sizes="32x32">
    <link data-react-helmet="true" rel="icon" type="image/svg" href="https://foobar.com/f1786e9b7cba9753ca7b9c40e8b98f67.svg" sizes="96x96">
  </head>
  <body>
    <div>foobar</div>
  </body>
</html>
    `;
  });

  const request = createRequest<NextApiRequest>({ method: 'GET', query: { host: 'https://foobar.com' } });
  const response = createResponse<NextApiResponse>();

  await handler(request, response);

  expect((fetch as jest.MockedFunction<typeof fetch>).mock.calls).toHaveLength(2);
});
