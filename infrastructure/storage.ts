import YAML from 'yaml';
import { AuthType, createClient } from 'webdav';

export const HOST = 'WEBDAV_HOST';
export const USERNAME = 'WEBDAV_USERNAME';
export const PASSWORD = 'WEBDAV_PASSWORD';
export const AUTH_TYPE = 'WEBDAV_AUTH_TYPE';
export const DIRECTORY = 'WEBDAV_DIR';

export async function read<T>(name: string): Promise<T | null> {
  const client = getWebdavClient();

  try {
    const yaml = (await client.getFileContents(getWebdavFilePath(name), { format: 'text' })) as string;

    if (!yaml.includes(':')) {
      return null;
    }

    return YAML.parse(yaml);
  } catch (e: any) {
    if (e.status === 404) {
      return null;
    }

    throw e;
  }
}

export async function write(name: string, value: unknown) {
  const client = getWebdavClient();
  const yaml = YAML.stringify(value);
  const buffer = Buffer.from(yaml, 'utf-8');

  try {
    await client.putFileContents(getWebdavFilePath(name), buffer, { overwrite: true, contentLength: buffer.length });
  } catch (e: any) {
    const root = process.env[DIRECTORY] || '/';

    if (e.status === 409 && !(await client.exists(root))) {
      try {
        await client.createDirectory(root, { recursive: true });
      } catch (ex) {
        throw ex;
      }

      await write(name, value);
    }

    throw e;
  }
}

function getWebdavClient() {
  const host = process.env[HOST];
  const username = process.env[USERNAME];
  const password = process.env[PASSWORD];
  const authType = process.env[AUTH_TYPE] === 'Digest' ? AuthType.Digest : AuthType.Password;

  if (!host) {
    throw new Error(`${HOST} is required`);
  }

  if (!username) {
    throw new Error(`${USERNAME} is required`);
  }

  if (!password) {
    throw new Error(`${PASSWORD} is required`);
  }

  return createClient(host, { authType, username, password, withCredentials: true });
}

function getWebdavFilePath(name: string) {
  const root = process.env[DIRECTORY] || '';

  return `${root}/${name}`;
}
