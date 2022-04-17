import Joi from 'joi';
import storage from 'infrastructure/storage';
import { Exception } from 'infrastructure/exception';

const DEFAULTS: ISetting = {
  weather: { enable: true, location: '北京 北京市' },
  search: { enable: true, autoFocus: true },
  ui: {
    clock: { enable: true, welcome: '你好' },
    favorite: { enable: true },
    bookmark: { enable: true },
  },
};

const linkBlockSchema = Joi.object({
  enable: Joi.boolean(),
  target: Joi.string().valid('_target', '_blank'),
}).required();

const schema = Joi.object<ISetting>({
  lastModifiedAt: Joi.string().isoDate(),
  weather: Joi.object({ enable: Joi.boolean(), location: Joi.string() }).required(),
  search: Joi.object({ enable: Joi.boolean(), autoFocus: Joi.boolean() }),
  ui: Joi.object({
    footer: Joi.string(),
    clock: Joi.object({ enable: Joi.boolean(), welcome: Joi.string() }).required(),
    favorite: linkBlockSchema,
    bookmark: linkBlockSchema,
  }).required(),
});

export async function get(): Promise<ISetting> {
  return { ...DEFAULTS, ...(await storage.read<ISetting>('settings.yml')) };
}

export async function set(data: ISetting): Promise<ISetting> {
  const { error, value } = schema.validate({ ...data, lastModifiedAt: new Date().toISOString() });

  if (error) {
    console.info('Setting request validate fail', error);

    throw new Exception(error.message);
  }

  await storage.write('settings.yml', value);

  return value!;
}
