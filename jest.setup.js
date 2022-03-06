/**
 * Importing next during test applies automated polyfills:
 *  - Polyfill the built-in "fetch" provided by Next.js
 *
 * @see https://github.com/vercel/next.js/discussions/13678#discussioncomment-22383 How to use built-in fetch in tests?
 * @see https://nextjs.org/blog/next-9-4#improved-built-in-fetch-support Next.js Blog - Improved Built-in Fetch Support
 * @see https://jestjs.io/docs/en/configuration#setupfilesafterenv-array About setupFilesAfterEnv usage
 */
require('next');
