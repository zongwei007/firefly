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
    ],
  }),
});

const config = (() => {
  const { error, value } = schema.validate({
    firefly: {
      title: process.env.FIREFLY_TITLE,
      username: process.env.FIREFLY_USERNAME,
      password: process.env.FIREFLY_PASSWORD,
      disableLogin: process.env.FIREFLY_DISABLE_LOGIN,
      expire: process.env.FIREFLY_EXPIRE,
    },
    storage: process.env.DISK_PATH
      ? { mode: 'disk', path: process.env.DISK_PATH }
      : {
          mode: 'webdav',
          host: process.env.WEBDAV_HOST,
          username: process.env.WEBDAV_USERNAME,
          password: process.env.WEBDAV_PASSWORD,
          authType: process.env.WEBDAV_AUTH_TYPE,
          directory: process.env.WEBDAV_DIRECTORY,
        },
  });

  if (error) {
    throw error;
  }

  return value!;
})();

export default config;
