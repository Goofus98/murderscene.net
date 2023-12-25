import { defineEventHandler, setHeader, createError } from 'file:///var/www/murderscene.net/node_modules/h3/dist/index.mjs';
import { parseURL, withoutTrailingSlash, withBase } from 'file:///var/www/murderscene.net/node_modules/ufo/dist/index.mjs';
import { f as fetchOptions, u as useHostname } from '../utils.mjs';
import { u as useProvider } from '../rollup/provider.mjs';
import 'node:fs';
import 'file:///var/www/murderscene.net/node_modules/pathe/dist/index.mjs';
import '../rollup/config.mjs';
import '../nitro/nitro-prerenderer.mjs';
import 'file:///var/www/murderscene.net/node_modules/node-fetch-native/dist/polyfill.mjs';
import 'file:///var/www/murderscene.net/node_modules/ofetch/dist/node.mjs';
import 'file:///var/www/murderscene.net/node_modules/destr/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/hookable/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/scule/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/klona/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/defu/dist/defu.mjs';
import 'file:///var/www/murderscene.net/node_modules/ohash/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/unstorage/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/unstorage/drivers/fs.mjs';
import 'file:///var/www/murderscene.net/node_modules/radix3/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/satori-html/dist/index.js';
import 'file:///var/www/murderscene.net/node_modules/twemoji/dist/twemoji.npm.js';
import 'file:///var/www/murderscene.net/node_modules/svg2png-wasm/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/satori/dist/index.js';

const og_png = defineEventHandler(async (e) => {
  const path = parseURL(e.path).pathname;
  if (!path.endsWith("__og_image__/og.png"))
    return;
  const basePath = withoutTrailingSlash(
    path.replace("__og_image__/og.png", "")
  );
  setHeader(e, "Content-Type", "image/png");
  setHeader(e, "Cache-Control", "no-cache, no-store, must-revalidate");
  setHeader(e, "Pragma", "no-cache");
  setHeader(e, "Expires", "0");
  const options = await fetchOptions(e, basePath);
  const provider = await useProvider(options.provider);
  if (!provider) {
    throw createError({
      statusCode: 500,
      statusMessage: `Provider ${options.provider} is missing.`
    });
  }
  return provider.createPng(withBase(basePath, useHostname(e)), options);
});

export { og_png as default };
//# sourceMappingURL=og.png.mjs.map
