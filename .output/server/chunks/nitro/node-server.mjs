globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, setHeader, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { klona } from 'klona';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      }
    }
  },
  "public": {
    "trailingSlash": false,
    "titleSeparator": "|",
    "siteName": "The Murder Scene",
    "siteUrl": "https://murderscene.net",
    "siteDescription": "Garry's Mod community home to unique gmod servers and the number one Murder server.",
    "language": "en",
    "siteImage": "https://murderscene.net/images/logo.png",
    "indexable": true,
    "stripekey": "pk_test_51NkglXBORpkfB4ZKsfEvqj9LscjDDumfC5lcRgUGZlFxb1MxB3v26C6hK5dSJsQRib1aGBgsL3s2XvaFezEq2wGZ00hGHW40qG",
    "gpPerDollar": "10000",
    "nuxt-unhead": {
      "seoOptimise": true,
      "resolveAliases": false
    }
  },
  "indexable": true
};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const _sharedRuntimeConfig = _deepFreeze(
  _applyEnv(klona(_inlineRuntimeConfig))
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  _applyEnv(runtimeConfig);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function _applyEnv(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = _getEnv(subKey);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      _applyEnv(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
  return obj;
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

storage.mount('/assets', assets$1);

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    setResponseHeader(event, "Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('../error-500.mjs');
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(await res.text());
});

const assets = {
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"773-bM+pazmkbF5o9HDFMOy3njY42Pc\"",
    "mtime": "2023-09-07T06:31:27.860Z",
    "size": 1907,
    "path": "../public/index.html"
  },
  "/inter-latin-ext-400-normal.woff": {
    "type": "font/woff",
    "etag": "\"abcc-ScgUlgU6NMSchk9cXQMUZeQG8fc\"",
    "mtime": "2023-09-07T06:31:26.572Z",
    "size": 43980,
    "path": "../public/inter-latin-ext-400-normal.woff"
  },
  "/inter-latin-ext-700-normal.woff": {
    "type": "font/woff",
    "etag": "\"bb34-btkmYi1MS9GkMFR4+gGPWRFxwKU\"",
    "mtime": "2023-09-07T06:31:26.572Z",
    "size": 47924,
    "path": "../public/inter-latin-ext-700-normal.woff"
  },
  "/robots.txt": {
    "type": "text/plain; charset=utf-8",
    "etag": "\"3b-f6+zn3GC0dM/3M7vW5VT5+rl/x8\"",
    "mtime": "2023-09-07T06:31:27.864Z",
    "size": 59,
    "path": "../public/robots.txt"
  },
  "/sitemap.xml": {
    "type": "application/xml",
    "etag": "\"24b-w01MRFiXzQd7Ti4W0bK+XN9g7HA\"",
    "mtime": "2023-09-07T06:31:27.868Z",
    "size": 587,
    "path": "../public/sitemap.xml"
  },
  "/svg2png.wasm": {
    "type": "application/wasm",
    "etag": "\"1bf667-JsF09mJVeSqlxzPPOrdAtUEgwrc\"",
    "mtime": "2023-09-07T06:31:26.564Z",
    "size": 1832551,
    "path": "../public/svg2png.wasm"
  },
  "/yoga.wasm": {
    "type": "application/wasm",
    "etag": "\"15a52-70hm7K4ZL9h3JwZ88sDAz5+4sCA\"",
    "mtime": "2023-09-07T06:31:26.556Z",
    "size": 88658,
    "path": "../public/yoga.wasm"
  },
  "/_nuxt/1.06482993.jpg": {
    "type": "image/jpeg",
    "etag": "\"78d4-6Kf6jDrAJFvCNjfRhR0gjlRzgaI\"",
    "mtime": "2023-09-07T06:31:26.548Z",
    "size": 30932,
    "path": "../public/_nuxt/1.06482993.jpg"
  },
  "/_nuxt/10.88477cdf.jpg": {
    "type": "image/jpeg",
    "etag": "\"5bcd-AbBiYMgTN7x+l0HPvv7+00q/BJM\"",
    "mtime": "2023-09-07T06:31:26.548Z",
    "size": 23501,
    "path": "../public/_nuxt/10.88477cdf.jpg"
  },
  "/_nuxt/11.50cc561c.jpg": {
    "type": "image/jpeg",
    "etag": "\"9b6f-N0K+0GSZGiPJAy6cg4g1qJy5Gl8\"",
    "mtime": "2023-09-07T06:31:26.548Z",
    "size": 39791,
    "path": "../public/_nuxt/11.50cc561c.jpg"
  },
  "/_nuxt/12.2f3366b9.jpg": {
    "type": "image/jpeg",
    "etag": "\"b7e5-YqvHa0bJtyXUe3M/htUCOC/iAD8\"",
    "mtime": "2023-09-07T06:31:26.548Z",
    "size": 47077,
    "path": "../public/_nuxt/12.2f3366b9.jpg"
  },
  "/_nuxt/13.5daf732d.jpg": {
    "type": "image/jpeg",
    "etag": "\"2089-JkUQSq893pB+jx2MsiZHZ19o5rI\"",
    "mtime": "2023-09-07T06:31:26.544Z",
    "size": 8329,
    "path": "../public/_nuxt/13.5daf732d.jpg"
  },
  "/_nuxt/14.7cb737b1.jpg": {
    "type": "image/jpeg",
    "etag": "\"2c7d-4qzHhrmP8vUbX9RScGFNJMy6zfU\"",
    "mtime": "2023-09-07T06:31:26.544Z",
    "size": 11389,
    "path": "../public/_nuxt/14.7cb737b1.jpg"
  },
  "/_nuxt/15.ed1573da.jpg": {
    "type": "image/jpeg",
    "etag": "\"100ea-EiMY7ci/3OdcpdJw3X/OTCfHuP8\"",
    "mtime": "2023-09-07T06:31:26.544Z",
    "size": 65770,
    "path": "../public/_nuxt/15.ed1573da.jpg"
  },
  "/_nuxt/16.053f21c9.jpg": {
    "type": "image/jpeg",
    "etag": "\"b0b0-E/b8UFv4EnEdDxnkV4gp7fpe7VM\"",
    "mtime": "2023-09-07T06:31:26.544Z",
    "size": 45232,
    "path": "../public/_nuxt/16.053f21c9.jpg"
  },
  "/_nuxt/17.2276e49b.jpg": {
    "type": "image/jpeg",
    "etag": "\"54f2-trN/sj33GWszeGO1iril5HGWdao\"",
    "mtime": "2023-09-07T06:31:26.544Z",
    "size": 21746,
    "path": "../public/_nuxt/17.2276e49b.jpg"
  },
  "/_nuxt/18.0c009474.jpg": {
    "type": "image/jpeg",
    "etag": "\"a224-4AAexvWMzHEhXMB7xRzov+v5BtQ\"",
    "mtime": "2023-09-07T06:31:26.544Z",
    "size": 41508,
    "path": "../public/_nuxt/18.0c009474.jpg"
  },
  "/_nuxt/19.709f4da8.jpg": {
    "type": "image/jpeg",
    "etag": "\"78f1-MJejrfhYkfQWJQ3gBD0L2FEknkM\"",
    "mtime": "2023-09-07T06:31:26.544Z",
    "size": 30961,
    "path": "../public/_nuxt/19.709f4da8.jpg"
  },
  "/_nuxt/2.68740942.jpg": {
    "type": "image/jpeg",
    "etag": "\"6446-fRcQn2nvn6d9iakrYlysbeYLV3U\"",
    "mtime": "2023-09-07T06:31:26.544Z",
    "size": 25670,
    "path": "../public/_nuxt/2.68740942.jpg"
  },
  "/_nuxt/20.ec1c38c0.jpg": {
    "type": "image/jpeg",
    "etag": "\"324f-qToMeqA6lJVarBfDwPuJ6HpN2LQ\"",
    "mtime": "2023-09-07T06:31:26.544Z",
    "size": 12879,
    "path": "../public/_nuxt/20.ec1c38c0.jpg"
  },
  "/_nuxt/21.364a01a3.jpg": {
    "type": "image/jpeg",
    "etag": "\"6bfb-3RXY67Ko1q3bmyRBZF7gUyqMqXk\"",
    "mtime": "2023-09-07T06:31:26.544Z",
    "size": 27643,
    "path": "../public/_nuxt/21.364a01a3.jpg"
  },
  "/_nuxt/22.621f6cfb.jpg": {
    "type": "image/jpeg",
    "etag": "\"5d0a-yfFRjQL8BTi5BLtEADBHafFq5WY\"",
    "mtime": "2023-09-07T06:31:26.540Z",
    "size": 23818,
    "path": "../public/_nuxt/22.621f6cfb.jpg"
  },
  "/_nuxt/23.e464117c.jpg": {
    "type": "image/jpeg",
    "etag": "\"aec9-W/Mlmk0XdADjAoz9yiIgIuYzPTc\"",
    "mtime": "2023-09-07T06:31:26.540Z",
    "size": 44745,
    "path": "../public/_nuxt/23.e464117c.jpg"
  },
  "/_nuxt/24.4fd65263.jpg": {
    "type": "image/jpeg",
    "etag": "\"7cbc-J/La8yxf8ur627d9W4MPq0VIjeU\"",
    "mtime": "2023-09-07T06:31:26.540Z",
    "size": 31932,
    "path": "../public/_nuxt/24.4fd65263.jpg"
  },
  "/_nuxt/25.bb860517.jpg": {
    "type": "image/jpeg",
    "etag": "\"9bde-X/F/nsx46yBmBaHcBZjOn2iIqvA\"",
    "mtime": "2023-09-07T06:31:26.540Z",
    "size": 39902,
    "path": "../public/_nuxt/25.bb860517.jpg"
  },
  "/_nuxt/3.7bbe48bc.jpg": {
    "type": "image/jpeg",
    "etag": "\"d911-9hucfxuokCm7yB7DvSWR+U4sA7A\"",
    "mtime": "2023-09-07T06:31:26.540Z",
    "size": 55569,
    "path": "../public/_nuxt/3.7bbe48bc.jpg"
  },
  "/_nuxt/4.5a5697e6.jpg": {
    "type": "image/jpeg",
    "etag": "\"6d70-yNy35XkO+DPvYXL7TH1r3gSgoe4\"",
    "mtime": "2023-09-07T06:31:26.540Z",
    "size": 28016,
    "path": "../public/_nuxt/4.5a5697e6.jpg"
  },
  "/_nuxt/5.1eb450b8.jpg": {
    "type": "image/jpeg",
    "etag": "\"7e35-bFD0p9ZYj/1pQPXyVsCsjtkqiw8\"",
    "mtime": "2023-09-07T06:31:26.540Z",
    "size": 32309,
    "path": "../public/_nuxt/5.1eb450b8.jpg"
  },
  "/_nuxt/6.51095b1c.jpg": {
    "type": "image/jpeg",
    "etag": "\"42b1-eE4zUtUKBmoxU+CfaamZ81RiDLc\"",
    "mtime": "2023-09-07T06:31:26.540Z",
    "size": 17073,
    "path": "../public/_nuxt/6.51095b1c.jpg"
  },
  "/_nuxt/7.edaa0d71.jpg": {
    "type": "image/jpeg",
    "etag": "\"4ecb-JRPh03cbdIqsIKf95B+PxEqcuQw\"",
    "mtime": "2023-09-07T06:31:26.540Z",
    "size": 20171,
    "path": "../public/_nuxt/7.edaa0d71.jpg"
  },
  "/_nuxt/8.9a2945bc.jpg": {
    "type": "image/jpeg",
    "etag": "\"d97a-0cOK8CE887JOwyDRHLGPF4dDN+A\"",
    "mtime": "2023-09-07T06:31:26.540Z",
    "size": 55674,
    "path": "../public/_nuxt/8.9a2945bc.jpg"
  },
  "/_nuxt/9.9d8a492b.jpg": {
    "type": "image/jpeg",
    "etag": "\"a9bf-ecqc+DYXtbYX7iwFZy4OPqKiYqY\"",
    "mtime": "2023-09-07T06:31:26.540Z",
    "size": 43455,
    "path": "../public/_nuxt/9.9d8a492b.jpg"
  },
  "/_nuxt/chip.1b587fc9.png": {
    "type": "image/png",
    "etag": "\"1bc0-wgEovcynQby97YfxY64tXOC5UmI\"",
    "mtime": "2023-09-07T06:31:26.536Z",
    "size": 7104,
    "path": "../public/_nuxt/chip.1b587fc9.png"
  },
  "/_nuxt/confirm.e2ccbafc.js": {
    "type": "application/javascript",
    "etag": "\"1756-bkn09O5VQ57u6Qn4o9iC3RpCBn0\"",
    "mtime": "2023-09-07T06:31:26.536Z",
    "size": 5974,
    "path": "../public/_nuxt/confirm.e2ccbafc.js"
  },
  "/_nuxt/confirm.f9bd37e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7c3-gSjA30bl4dHT1i26E14VpvYigpI\"",
    "mtime": "2023-09-07T06:31:26.536Z",
    "size": 1987,
    "path": "../public/_nuxt/confirm.f9bd37e9.css"
  },
  "/_nuxt/directive.7fcbe426.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"64b-7GOJ4mrzVChwWni+xWuhV4uQNT8\"",
    "mtime": "2023-09-07T06:31:26.536Z",
    "size": 1611,
    "path": "../public/_nuxt/directive.7fcbe426.css"
  },
  "/_nuxt/directive.ebc2a5d9.js": {
    "type": "application/javascript",
    "etag": "\"12d3-hym6d8tiNSfqVVnwCMgSGDC/iRM\"",
    "mtime": "2023-09-07T06:31:26.536Z",
    "size": 4819,
    "path": "../public/_nuxt/directive.ebc2a5d9.js"
  },
  "/_nuxt/donate.735ab15f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3ac5-oIZAdK7ZQ/wGopJXhlb7BlXjfOE\"",
    "mtime": "2023-09-07T06:31:26.536Z",
    "size": 15045,
    "path": "../public/_nuxt/donate.735ab15f.css"
  },
  "/_nuxt/donate.e5c54217.js": {
    "type": "application/javascript",
    "etag": "\"3bea-qI8AwL9OHeAjYPa+r4MveF03838\"",
    "mtime": "2023-09-07T06:31:26.536Z",
    "size": 15338,
    "path": "../public/_nuxt/donate.e5c54217.js"
  },
  "/_nuxt/entry.a98884ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9333-/KqZxV09XeIM2h5UlmSsMcymcz4\"",
    "mtime": "2023-09-07T06:31:26.536Z",
    "size": 37683,
    "path": "../public/_nuxt/entry.a98884ce.css"
  },
  "/_nuxt/entry.ec10e388.js": {
    "type": "application/javascript",
    "etag": "\"4c283-3ezM9z8oBzFE9XfPONdCK/zXOhE\"",
    "mtime": "2023-09-07T06:31:26.536Z",
    "size": 311939,
    "path": "../public/_nuxt/entry.ec10e388.js"
  },
  "/_nuxt/error-component.5cb854dc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"fc-j5uRulbIEIw0bvsKaQhTLPOK5k8\"",
    "mtime": "2023-09-07T06:31:26.536Z",
    "size": 252,
    "path": "../public/_nuxt/error-component.5cb854dc.css"
  },
  "/_nuxt/error-component.bafe576f.js": {
    "type": "application/javascript",
    "etag": "\"1b2-8S2jKhIvASGJTE26b0MHzXB77yk\"",
    "mtime": "2023-09-07T06:31:26.536Z",
    "size": 434,
    "path": "../public/_nuxt/error-component.bafe576f.js"
  },
  "/_nuxt/index.3473db9b.js": {
    "type": "application/javascript",
    "etag": "\"180f-+v1WlaBaNWEl2ufEj3TVATdXm9E\"",
    "mtime": "2023-09-07T06:31:26.532Z",
    "size": 6159,
    "path": "../public/_nuxt/index.3473db9b.js"
  },
  "/_nuxt/index.985f8731.js": {
    "type": "application/javascript",
    "etag": "\"121ee-IaOwldY1SJfVAhdwnkHlCu1Clmg\"",
    "mtime": "2023-09-07T06:31:26.532Z",
    "size": 74222,
    "path": "../public/_nuxt/index.985f8731.js"
  },
  "/_nuxt/index.bb2fdf49.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3b4f-NrCE+YQNTkVOKpCCL+UJFU0zgQI\"",
    "mtime": "2023-09-07T06:31:26.532Z",
    "size": 15183,
    "path": "../public/_nuxt/index.bb2fdf49.css"
  },
  "/_nuxt/rules.13baaa1e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"635-Dm9h92QDthp3muAqIM0K3+57FP8\"",
    "mtime": "2023-09-07T06:31:26.532Z",
    "size": 1589,
    "path": "../public/_nuxt/rules.13baaa1e.css"
  },
  "/_nuxt/rules.27e79bda.js": {
    "type": "application/javascript",
    "etag": "\"a36-ON02lEFFgFK04pZNskKLuDETDKE\"",
    "mtime": "2023-09-07T06:31:26.532Z",
    "size": 2614,
    "path": "../public/_nuxt/rules.27e79bda.js"
  },
  "/_nuxt/staff.48dbcaad.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed4-UHgnr9DAcXLJYknjBELrUxRd5j8\"",
    "mtime": "2023-09-07T06:31:26.532Z",
    "size": 3796,
    "path": "../public/_nuxt/staff.48dbcaad.css"
  },
  "/_nuxt/staff.df795a41.js": {
    "type": "application/javascript",
    "etag": "\"2f43-vy6BPTBNMnYbVbNtG+0S+UvHXRQ\"",
    "mtime": "2023-09-07T06:31:26.532Z",
    "size": 12099,
    "path": "../public/_nuxt/staff.df795a41.js"
  },
  "/_nuxt/throttle.a161ea4e.js": {
    "type": "application/javascript",
    "etag": "\"6d1-fZ8mlPybxUJcX1Bs9Qdjj52lMko\"",
    "mtime": "2023-09-07T06:31:26.532Z",
    "size": 1745,
    "path": "../public/_nuxt/throttle.a161ea4e.js"
  },
  "/_nuxt/unionpay.806a26d6.png": {
    "type": "image/png",
    "etag": "\"1c31-RgRUGBgDrjSjThomqESA/dGO8Ps\"",
    "mtime": "2023-09-07T06:31:26.532Z",
    "size": 7217,
    "path": "../public/_nuxt/unionpay.806a26d6.png"
  },
  "/images/favicon.png": {
    "type": "image/png",
    "etag": "\"4d8f-RyBIZawkFpWhuP4qcOZOfyFK72g\"",
    "mtime": "2023-09-07T06:31:26.556Z",
    "size": 19855,
    "path": "../public/images/favicon.png"
  },
  "/images/list.svg": {
    "type": "image/svg+xml",
    "etag": "\"558-ZbsuMSmYWNCoEAgbbPuPO4K8+OI\"",
    "mtime": "2023-09-07T06:31:26.556Z",
    "size": 1368,
    "path": "../public/images/list.svg"
  },
  "/images/logo.png": {
    "type": "image/png",
    "etag": "\"11fcb-vvpJejBEUrOj9tmP505JHMCoT9o\"",
    "mtime": "2023-09-07T06:31:26.556Z",
    "size": 73675,
    "path": "../public/images/logo.png"
  },
  "/images/paypal.svg": {
    "type": "image/svg+xml",
    "etag": "\"cc2-1k+rWdxBghHZVpfiv/zfyA3Nz18\"",
    "mtime": "2023-09-07T06:31:26.556Z",
    "size": 3266,
    "path": "../public/images/paypal.svg"
  },
  "/images/social.png": {
    "type": "image/png",
    "etag": "\"8b48-nkSgi3TEs3Ykc9SRaPifbE0Xvk4\"",
    "mtime": "2023-09-07T06:31:26.552Z",
    "size": 35656,
    "path": "../public/images/social.png"
  },
  "/images/ss1.png": {
    "type": "image/png",
    "etag": "\"62cc1-aAC8B/Jnoss63MxCcwBIMsddgq4\"",
    "mtime": "2023-09-07T06:31:26.552Z",
    "size": 404673,
    "path": "../public/images/ss1.png"
  },
  "/images/ss2.png": {
    "type": "image/png",
    "etag": "\"6e20f-orZl9fuzGaZhfBjG50HycKmbSo8\"",
    "mtime": "2023-09-07T06:31:26.552Z",
    "size": 451087,
    "path": "../public/images/ss2.png"
  },
  "/images/ss3.png": {
    "type": "image/png",
    "etag": "\"5fcba-suFlz/E9CU30eot36OLgYFbdWMc\"",
    "mtime": "2023-09-07T06:31:26.552Z",
    "size": 392378,
    "path": "../public/images/ss3.png"
  },
  "/images/ss4.png": {
    "type": "image/png",
    "etag": "\"61cd3-Qm0+Wjw7OFAFuFvXr87tEOSTupw\"",
    "mtime": "2023-09-07T06:31:26.548Z",
    "size": 400595,
    "path": "../public/images/ss4.png"
  },
  "/images/ss5.png": {
    "type": "image/png",
    "etag": "\"30cf8-u3sLLFLd6fWTxso/CYPj76mlCzY\"",
    "mtime": "2023-09-07T06:31:26.548Z",
    "size": 199928,
    "path": "../public/images/ss5.png"
  },
  "/images/steam_login.png": {
    "type": "image/png",
    "etag": "\"66f2-DvT6au/tlu0F9tMPLdluS+BnpkE\"",
    "mtime": "2023-09-07T06:31:26.548Z",
    "size": 26354,
    "path": "../public/images/steam_login.png"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const disallow = [];
const sitemap = ["https://murderscene.net/sitemap.xml"];
const indexable = true;
const robotsDisabledValue = "noindex, nofollow";

const asArray = (v) => Array.isArray(v) ? v : [v];
const _yCXAvk = defineEventHandler(async (event) => {
  setHeader(event, "Content-Type", "text/plain");
  const debug = "";
  const sitemapLink = (sitemap && indexable ? asArray(sitemap || []) : []).map((path) => `Sitemap: ${path}`).join("\n");
  const disallowedPaths = (asArray(disallow || []) ).map((path) => `Disallow: ${path}`).join("\n");
  return `${debug}User-agent: *
${disallowedPaths}
${sitemapLink}`;
});

const _17P5uU = defineEventHandler((event) => {
  if (event.path === "/robots.txt")
    return;
  const routeRules = getRouteRules(event);
  if (typeof routeRules.robots === "string")
    setHeader(event, "X-Robots-Tag", routeRules.robots);
  else if (routeRules.index === false || indexable === false)
    setHeader(event, "X-Robots-Tag", robotsDisabledValue);
});

const _lazy_mvhkXW = () => import('../handlers/renderer.mjs');
const _lazy_AS9iVV = () => import('../handlers/og.png.mjs');
const _lazy_Q8Btv4 = () => import('../handlers/html.mjs');
const _lazy_OKNNGt = () => import('../handlers/options.mjs');
const _lazy_fNu5Uu = () => import('../handlers/svg.mjs');
const _lazy_cfa128 = () => import('../handlers/vnode.mjs');
const _lazy_vJD1kT = () => import('../handlers/font.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_mvhkXW, lazy: true, middleware: false, method: undefined },
  { route: '/robots.txt', handler: _yCXAvk, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _17P5uU, lazy: false, middleware: false, method: undefined },
  { route: '', handler: _lazy_AS9iVV, lazy: true, middleware: false, method: undefined },
  { route: '/api/og-image-html', handler: _lazy_Q8Btv4, lazy: true, middleware: false, method: undefined },
  { route: '/api/og-image-options', handler: _lazy_OKNNGt, lazy: true, middleware: false, method: undefined },
  { route: '/api/og-image-svg', handler: _lazy_fNu5Uu, lazy: true, middleware: false, method: undefined },
  { route: '/api/og-image-vnode', handler: _lazy_cfa128, lazy: true, middleware: false, method: undefined },
  { route: '/api/og-image-font', handler: _lazy_vJD1kT, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_mvhkXW, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      event.context.nitro = event.context.nitro || {};
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: $fetch });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on(
    "unhandledRejection",
    (err) => console.error("[nitro] [dev] [unhandledRejection] " + err)
  );
  process.on(
    "uncaughtException",
    (err) => console.error("[nitro] [dev] [uncaughtException] " + err)
  );
}
const nodeServer = {};

export { useRuntimeConfig as a, useStorage as b, defineCachedEventHandler as d, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
