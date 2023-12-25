import { getQuery } from 'file:///var/www/murderscene.net/node_modules/h3/dist/index.mjs';
import { d as defineCachedEventHandler } from '../nitro/nitro-prerenderer.mjs';
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

const font = defineCachedEventHandler(async (e) => {
  const { name, weight } = getQuery(e);
  if (!name || !weight)
    return "Provide a font name and weight";
  const css = await await globalThis.$fetch(`https://fonts.googleapis.com/css2?family=${name}:wght@${weight}`, {
    headers: {
      // Make sure it returns TTF.
      "User-Agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"
    }
  });
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);
  if (!resource)
    return;
  return resource[1];
}, {
  getKey: (e) => {
    const query = getQuery(e);
    return `nuxt-og-image:font-url:${query.name}:${query.weight}`;
  }
});

export { font as default };
//# sourceMappingURL=font.mjs.map
