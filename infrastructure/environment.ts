export function get(): GlobalConfiguration {
  //TODO 参数校验

  return {
    firefly: {
      title: process.env.FIREFLY_TITLE || 'Firefly',
      username: process.env.FIREFLY_USERNAME,
      password: process.env.FIREFLY_PASSWORD,
      disableLogin: process.env.FIREFLY_DISABLE_LOGIN === 'false',
      expire: parseInt(process.env.FIREFLY_EXPIRE || '86400'),
    },
    webdav: {
      host: process.env.WEBDAV_HOST!,
      username: process.env.WEBDAV_USERNAME!,
      password: process.env.WEBDAV_PASSWORD!,
      authType: process.env.WEBDAV_AUTH_TYPE === 'Digest' ? 'Digest' : 'Password',
      directory: process.env.WEBDAV_DIRECTORY || '/',
    },
  };
}
