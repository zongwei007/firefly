import YAML from 'yaml';
import { AuthType, createClient } from 'webdav';
import * as environment from 'infrastructure/environment';

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
    const { webdav } = environment.get();

    if (e.status === 409 && !(await client.exists(webdav.directory))) {
      try {
        await client.createDirectory(webdav.directory, { recursive: true });
      } catch (ex) {
        throw ex;
      }

      await write(name, value);
    }

    throw e;
  }
}

function getWebdavClient() {
  const { webdav } = environment.get();
  const authType = webdav.authType === 'Digest' ? AuthType.Digest : AuthType.Password;

  return createClient(webdav.host, {
    authType,
    username: webdav.username,
    password: webdav.password,
    withCredentials: true,
  });
}

function getWebdavFilePath(name: string) {
  const { webdav } = environment.get();

  return `${webdav.directory}/${name}`;
}
