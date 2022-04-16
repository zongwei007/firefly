import Joi from 'joi';
import storage from 'infrastructure/storage';
import { Exception } from 'infrastructure/exception';

const schema = Joi.object<IBookmarkConfiguration>({
  lastModifiedAt: Joi.string().isoDuration(),
  categories: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
      })
    )
    .required(),
  bookmarks: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        link: Joi.string().uri().required(),
        icon: Joi.string(),
        desc: Joi.string(),
        category: Joi.string(),
        pined: Joi.boolean(),
        private: Joi.boolean(),
      })
    )
    .required(),
});

export async function list(anonymous: boolean): Promise<IBookmarkConfiguration> {
  const data = (await storage.read<IBookmarkConfiguration>('bookmarks.yml')) || {
    bookmarks: [],
    categories: [],
  };

  return { ...data, bookmarks: data.bookmarks.filter(ele => (anonymous ? ele.private !== true : true)) };
}

export async function set(data: IBookmarkConfiguration): Promise<IBookmarkConfiguration> {
  const { error, value } = schema.validate({ ...data, lastModifiedAt: new Date().toISOString() });

  if (error) {
    console.info('Setting request validate fail', error);

    throw new Exception(error.message);
  }

  await storage.write('bookmarks.yml', value);

  return value!;
}
