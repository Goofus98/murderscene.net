import { defineEventHandler, getQuery, getHeaders, createError } from 'file:///var/www/murderscene.net/node_modules/h3/dist/index.mjs';
import { d as defaults } from '../rollup/config.mjs';
import { g as getRouteRules } from '../nitro/nitro-prerenderer.mjs';
import 'file:///var/www/murderscene.net/node_modules/node-fetch-native/dist/polyfill.mjs';
import 'file:///var/www/murderscene.net/node_modules/ofetch/dist/node.mjs';
import 'file:///var/www/murderscene.net/node_modules/destr/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/hookable/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/scule/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/klona/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/defu/dist/defu.mjs';
import 'file:///var/www/murderscene.net/node_modules/ohash/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/ufo/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/unstorage/dist/index.mjs';
import 'file:///var/www/murderscene.net/node_modules/unstorage/drivers/fs.mjs';
import 'file:///var/www/murderscene.net/node_modules/radix3/dist/index.mjs';

function decodeHtmlEntities(obj) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "string") {
      obj[key] = value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/");
    }
  });
  return obj;
}
function extractOgImageOptions(html) {
  const htmlPayload = html.match(/<script id="nuxt-og-image-options" type="application\/json">(.+?)<\/script>/)?.[1];
  if (!htmlPayload)
    return false;
  let options;
  try {
    options = JSON.parse(htmlPayload);
  } catch (e) {
    options = false;
  }
  if (options) {
    const description = html.match(/<meta property="og:description" content="(.*?)">/)?.[1];
    if (description)
      options.description = description;
    else
      options.description = html.match(/<meta name="description" content="(.*?)">/)?.[1];
    return decodeHtmlEntities(options);
  }
  return false;
}

const options = defineEventHandler(async (e) => {
  const query = getQuery(e);
  const path = query.path || "/";
  const fetchOptions = {
    headers: getHeaders(e)
  } ;
  const html = await globalThis.$fetch(path, {
    ...fetchOptions
  });
  const extractedPayload = extractOgImageOptions(html);
  if (!extractedPayload) {
    throw createError({
      statusCode: 500,
      statusMessage: `The path ${path} is missing the og-image payload.`
    });
  }
  e.node.req.url = path;
  e.context._nitro.routeRules = void 0;
  const routeRules = getRouteRules(e)?.ogImage;
  e.node.req.url = e.path;
  if (routeRules === false)
    return false;
  return {
    path,
    ...defaults,
    // use route rules
    ...routeRules || {},
    // use provided data
    ...extractedPayload,
    // use query data
    ...query
  };
});

export { options as default };
//# sourceMappingURL=options.mjs.map
