import Joi from 'joi';

const loginFieldSchema = Joi.when('disableLogin', {
  is: Joi.equal(true),
  then: Joi.string(),
  otherwise: Joi.string().required(),
});

const schema = Joi.object<GlobalConfiguration>({
  firefly: Joi.object({
    title: Joi.string().default('Firefly'),
    disableLogin: Joi.boolean().default(false),
    username: loginFieldSchema,
    password: loginFieldSchema,
    expire: Joi.number().greater(0).default(864000),
  }),
  storage: Joi.when('.mode', {
    switch: [
      {
        is: Joi.equal('disk'),
        then: Joi.object({
          mode: Joi.string(),
          path: Joi.string().required(),
        }),
      },
      {
        is: Joi.equal('webdav'),
        then: Joi.object({
          mode: Joi.string(),
          host: Joi.string()
            .uri({ scheme: ['http', 'https'] })
            .required(),
          username: Joi.string().required(),
          password: Joi.string().required(),
          authType: Joi.string().valid('Digest', 'Password').default('Password'),
          directory: Joi.string().default('/'),
        }),
      },
      {
        is: Joi.equal('upstash-redis'),
        then: Joi.object({
          mode: Joi.string(),
          url: Joi.string()
            .uri({ scheme: ['http', 'https'] })
            .required(),
          token: Joi.string().required(),
          prefix: Joi.string().default('firefly:'),
        }),
      },
    ],
  }),
});

let config: GlobalConfiguration | null = null;

/** 按环境变量选择存储后端：Upstash Redis > WebDAV > 本地磁盘 */
function resolveStorage(): GlobalConfiguration['storage'] {
  const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    return {
      mode: 'upstash-redis',
      url: redisUrl,
      token: redisToken,
      prefix: process.env.REDIS_KEY_PREFIX ?? 'firefly:',
    };
  }

  if (process.env.WEBDAV_HOST) {
    return {
      mode: 'webdav',
      host: process.env.WEBDAV_HOST,
      username: process.env.WEBDAV_USERNAME!,
      password: process.env.WEBDAV_PASSWORD!,
      authType: process.env.WEBDAV_AUTH_TYPE as 'Digest' | 'Password',
      directory: process.env.WEBDAV_DIRECTORY!,
    };
  }

  return { mode: 'disk', path: process.env.DISK_PATH! };
}

export default function getConfiguration(): GlobalConfiguration {
  if (!config) {
    const { error, value } = schema.validate({
      firefly: {
        title: process.env.FIREFLY_TITLE,
        username: process.env.FIREFLY_USERNAME,
        password: process.env.FIREFLY_PASSWORD,
        disableLogin: process.env.FIREFLY_DISABLE_LOGIN,
        expire: process.env.FIREFLY_EXPIRE,
      },
      storage: resolveStorage(),
    });

    if (error) {
      throw error;
    }

    config = value;
  }

  return config;
}
