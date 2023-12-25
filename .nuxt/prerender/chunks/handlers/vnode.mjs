import { defineEventHandler, getQuery, setHeader, createError } from 'file:///var/www/murderscene.net/node_modules/h3/dist/index.mjs';
import { withBase } from 'file:///var/www/murderscene.net/node_modules/ufo/dist/index.mjs';
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

const vnode = defineEventHandler(async (e) => {
  const path = getQuery(e).path || "/";
  const options = await fetchOptions(e, path);
  setHeader(e, "Content-Type", "application/json");
  const provider = await useProvider(options.provider);
  if (!provider) {
    throw createError({
      statusCode: 500,
      statusMessage: `Provider ${options.provider} is missing.`
    });
  }
  return provider.createVNode(withBase(path, useHostname(e)), options);
});

export { vnode as default };
//# sourceMappingURL=vnode.mjs.map
