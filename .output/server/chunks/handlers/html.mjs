import { withBase } from 'ufo';
import { renderSSRHead } from '@unhead/ssr';
import { defineEventHandler, getQuery, sendRedirect } from 'h3';
import { f as fetchOptions, u as useHostname, r as renderIsland, a as fonts, d as defaults } from '../utils.mjs';
import { createHooks } from 'hookable';
import { defineHeadPlugin, tagDedupeKey, tagWeight, HasElementTags, hashCode, SortModifiers, processTemplateParams, resolveTitleTemplate, IsBrowser, normaliseEntryTags } from '@unhead/shared';
import 'node:fs';
import 'pathe';
import '../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'ofetch';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'klona';
import 'defu';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:url';

const UsesMergeStrategy = ["templateParams", "htmlAttrs", "bodyAttrs"];
const DedupePlugin = defineHeadPlugin({
  hooks: {
    "tag:normalise": function({ tag }) {
      ["hid", "vmid", "key"].forEach((key) => {
        if (tag.props[key]) {
          tag.key = tag.props[key];
          delete tag.props[key];
        }
      });
      const generatedKey = tagDedupeKey(tag);
      const dedupe = generatedKey || (tag.key ? `${tag.tag}:${tag.key}` : false);
      if (dedupe)
        tag._d = dedupe;
    },
    "tags:resolve": function(ctx) {
      const deduping = {};
      ctx.tags.forEach((tag) => {
        const dedupeKey = (tag.key ? `${tag.tag}:${tag.key}` : tag._d) || tag._p;
        const dupedTag = deduping[dedupeKey];
        if (dupedTag) {
          let strategy = tag?.tagDuplicateStrategy;
          if (!strategy && UsesMergeStrategy.includes(tag.tag))
            strategy = "merge";
          if (strategy === "merge") {
            const oldProps = dupedTag.props;
            ["class", "style"].forEach((key) => {
              if (tag.props[key] && oldProps[key]) {
                if (key === "style" && !oldProps[key].endsWith(";"))
                  oldProps[key] += ";";
                tag.props[key] = `${oldProps[key]} ${tag.props[key]}`;
              }
            });
            deduping[dedupeKey].props = {
              ...oldProps,
              ...tag.props
            };
            return;
          } else if (tag._e === dupedTag._e) {
            dupedTag._duped = dupedTag._duped || [];
            tag._d = `${dupedTag._d}:${dupedTag._duped.length + 1}`;
            dupedTag._duped.push(tag);
            return;
          } else if (tagWeight(tag) > tagWeight(dupedTag)) {
            return;
          }
        }
        const propCount = Object.keys(tag.props).length + (tag.innerHTML ? 1 : 0) + (tag.textContent ? 1 : 0);
        if (HasElementTags.includes(tag.tag) && propCount === 0) {
          delete deduping[dedupeKey];
          return;
        }
        deduping[dedupeKey] = tag;
      });
      const newTags = [];
      Object.values(deduping).forEach((tag) => {
        const dupes = tag._duped;
        delete tag._duped;
        newTags.push(tag);
        if (dupes)
          newTags.push(...dupes);
      });
      ctx.tags = newTags;
    }
  }
});

const PayloadPlugin = defineHeadPlugin({
  mode: "server",
  hooks: {
    "tags:resolve": function(ctx) {
      const csrPayload = {};
      ctx.tags.filter((tag) => ["titleTemplate", "templateParams"].includes(tag.tag) && tag._m === "server").forEach((tag) => {
        csrPayload[tag.tag] = tag.tag === "titleTemplate" ? tag.textContent : tag.props;
      });
      Object.keys(csrPayload).length && ctx.tags.push({
        tag: "script",
        innerHTML: JSON.stringify(csrPayload),
        props: { id: "unhead:payload", type: "application/json" }
      });
    }
  }
});

const ValidEventTags = ["script", "link", "bodyAttrs"];
function stripEventHandlers(tag) {
  const props = {};
  const eventHandlers = {};
  Object.entries(tag.props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function")
      eventHandlers[key] = value;
    else
      props[key] = value;
  });
  return { props, eventHandlers };
}
const EventHandlersPlugin = defineHeadPlugin({
  hooks: {
    "ssr:render": function(ctx) {
      ctx.tags = ctx.tags.map((tag) => {
        if (!ValidEventTags.includes(tag.tag))
          return tag;
        if (!Object.entries(tag.props).find(([key, value]) => key.startsWith("on") && typeof value === "function"))
          return tag;
        tag.props = stripEventHandlers(tag).props;
        return tag;
      });
    },
    "tags:resolve": function(ctx) {
      ctx.tags = ctx.tags.map((tag) => {
        if (!ValidEventTags.includes(tag.tag))
          return tag;
        const { props, eventHandlers } = stripEventHandlers(tag);
        if (Object.keys(eventHandlers).length) {
          tag.props = props;
          tag._eventHandlers = eventHandlers;
        }
        return tag;
      });
    },
    "dom:renderTag": function(ctx, dom, track) {
      if (!ctx.tag._eventHandlers)
        return;
      const $eventListenerTarget = ctx.tag.tag === "bodyAttrs" ? dom.defaultView : ctx.$el;
      Object.entries(ctx.tag._eventHandlers).forEach(([k, value]) => {
        const sdeKey = `${ctx.tag._d || ctx.tag._p}:${k}`;
        const eventName = k.slice(2).toLowerCase();
        const eventDedupeKey = `data-h-${eventName}`;
        track(ctx.id, sdeKey, () => {
        });
        if (ctx.$el.hasAttribute(eventDedupeKey))
          return;
        const handler = value;
        ctx.$el.setAttribute(eventDedupeKey, "");
        $eventListenerTarget.addEventListener(eventName, handler);
        if (ctx.entry) {
          track(ctx.id, sdeKey, () => {
            $eventListenerTarget.removeEventListener(eventName, handler);
            ctx.$el.removeAttribute(eventDedupeKey);
          });
        }
      });
    }
  }
});

const DupeableTags = ["link", "style", "script", "noscript"];
const HashKeyedPlugin = defineHeadPlugin({
  hooks: {
    "tag:normalise": ({ tag }) => {
      if (tag.key && DupeableTags.includes(tag.tag)) {
        tag.props["data-hid"] = tag._h = hashCode(tag.key);
      }
    }
  }
});

const SortPlugin = defineHeadPlugin({
  hooks: {
    "tags:resolve": (ctx) => {
      const tagPositionForKey = (key) => ctx.tags.find((tag) => tag._d === key)?._p;
      for (const { prefix, offset } of SortModifiers) {
        for (const tag of ctx.tags.filter((tag2) => typeof tag2.tagPriority === "string" && tag2.tagPriority.startsWith(prefix))) {
          const position = tagPositionForKey(
            tag.tagPriority.replace(prefix, "")
          );
          if (typeof position !== "undefined")
            tag._p = position + offset;
        }
      }
      ctx.tags.sort((a, b) => a._p - b._p).sort((a, b) => tagWeight(a) - tagWeight(b));
    }
  }
});

const TemplateParamsPlugin = defineHeadPlugin({
  hooks: {
    "tags:resolve": (ctx) => {
      const { tags } = ctx;
      const title = tags.find((tag) => tag.tag === "title")?.textContent;
      const idx = tags.findIndex((tag) => tag.tag === "templateParams");
      const params = idx !== -1 ? tags[idx].props : {};
      params.separator = params.separator || "|";
      params.pageTitle = processTemplateParams(params.pageTitle || title || "", params);
      for (const tag of tags) {
        if (["titleTemplate", "title"].includes(tag.tag) && typeof tag.textContent === "string")
          tag.textContent = processTemplateParams(tag.textContent, params);
        else if (tag.tag === "meta" && typeof tag.props.content === "string")
          tag.props.content = processTemplateParams(tag.props.content, params);
        else if (tag.tag === "link" && typeof tag.props.href === "string")
          tag.props.href = processTemplateParams(tag.props.href, params);
        else if (tag.tag === "script" && ["application/json", "application/ld+json"].includes(tag.props.type) && tag.innerHTML)
          tag.innerHTML = processTemplateParams(tag.innerHTML, params);
      }
      ctx.tags = tags.filter((tag) => tag.tag !== "templateParams");
    }
  }
});

const TitleTemplatePlugin = defineHeadPlugin({
  hooks: {
    "tags:resolve": (ctx) => {
      const { tags } = ctx;
      let titleTemplateIdx = tags.findIndex((i) => i.tag === "titleTemplate");
      const titleIdx = tags.findIndex((i) => i.tag === "title");
      if (titleIdx !== -1 && titleTemplateIdx !== -1) {
        const newTitle = resolveTitleTemplate(
          tags[titleTemplateIdx].textContent,
          tags[titleIdx].textContent
        );
        if (newTitle !== null) {
          tags[titleIdx].textContent = newTitle || tags[titleIdx].textContent;
        } else {
          delete tags[titleIdx];
        }
      } else if (titleTemplateIdx !== -1) {
        const newTitle = resolveTitleTemplate(
          tags[titleTemplateIdx].textContent
        );
        if (newTitle !== null) {
          tags[titleTemplateIdx].textContent = newTitle;
          tags[titleTemplateIdx].tag = "title";
          titleTemplateIdx = -1;
        }
      }
      if (titleTemplateIdx !== -1) {
        delete tags[titleTemplateIdx];
      }
      ctx.tags = tags.filter(Boolean);
    }
  }
});
function filterMode(mode, ssr) {
  return !mode || mode === "server" && ssr || mode === "client" && !ssr;
}
function createHeadCore(options = {}) {
  const hooks = createHooks();
  hooks.addHooks(options.hooks || {});
  options.document = options.document || (IsBrowser ? document : void 0);
  const ssr = !options.document;
  options.plugins = [
    DedupePlugin,
    PayloadPlugin,
    EventHandlersPlugin,
    HashKeyedPlugin,
    SortPlugin,
    TemplateParamsPlugin,
    TitleTemplatePlugin,
    ...options?.plugins || []
  ];
  const updated = () => hooks.callHook("entries:updated", head);
  let entryCount = 0;
  let entries = [];
  const head = {
    resolvedOptions: options,
    hooks,
    headEntries() {
      return entries;
    },
    use(p) {
      const plugin = typeof p === "function" ? p(head) : p;
      filterMode(plugin.mode, ssr) && hooks.addHooks(plugin.hooks || {});
    },
    push(input, entryOptions) {
      const entry = {
        _i: entryCount++,
        input,
        ...entryOptions
      };
      if (filterMode(entry.mode, ssr)) {
        entries.push(entry);
        updated();
      }
      return {
        dispose() {
          entries = entries.filter((e) => e._i !== entry._i);
          hooks.callHook("entries:updated", head);
          updated();
        },
        // a patch is the same as creating a new entry, just a nice DX
        patch(input2) {
          entries = entries.map((e) => {
            if (e._i === entry._i) {
              e.input = entry.input = input2;
            }
            return e;
          });
          updated();
        }
      };
    },
    async resolveTags() {
      const resolveCtx = { tags: [], entries: [...entries] };
      await hooks.callHook("entries:resolve", resolveCtx);
      for (const entry of resolveCtx.entries) {
        const resolved = entry.resolvedInput || entry.input;
        entry.resolvedInput = await (entry.transform ? entry.transform(resolved) : resolved);
        if (entry.resolvedInput) {
          for (const tag of await normaliseEntryTags(entry)) {
            const tagCtx = { tag, entry, resolvedOptions: head.resolvedOptions };
            await hooks.callHook("tag:normalise", tagCtx);
            resolveCtx.tags.push(tagCtx.tag);
          }
        }
      }
      await hooks.callHook("tags:beforeResolve", resolveCtx);
      await hooks.callHook("tags:resolve", resolveCtx);
      return resolveCtx.tags;
    },
    ssr
  };
  options.plugins.forEach((p) => head.use(p));
  head.hooks.callHook("init", head);
  return head;
}

const html = defineEventHandler(async (e) => {
  const path = getQuery(e).path || "/";
  const scale = getQuery(e).scale;
  const mode = getQuery(e).mode || "light";
  let options;
  if (getQuery(e).options)
    options = JSON.parse(getQuery(e).options);
  if (!options)
    options = await fetchOptions(e, path);
  if (options.provider === "browser" && !options.component)
    return sendRedirect(e, withBase(path, useHostname(e)));
  const island = await renderIsland(options);
  const head = createHeadCore();
  head.push(island.head);
  head.push({
    style: [
      {
        // default font is the first font family
        innerHTML: `body { font-family: '${fonts[0].split(":")[0].replace("+", " ")}', sans-serif;  }`
      },
      scale ? {
        innerHTML: `body {
    transform: scale(${scale});
    transform-origin: top left;
    max-height: 100vh;
    position: relative;
    width: ${defaults.width}px;
    height: ${defaults.height}px;
    overflow: hidden;
    background-color: ${mode === "dark" ? "#1b1b1b" : "#fff"};
}
img.emoji {
   height: 1em;
   width: 1em;
   margin: 0 .05em 0 .1em;
   vertical-align: -0.1em;
}
`
      } : {}
    ],
    meta: [
      {
        charset: "utf-8"
      }
    ],
    script: [
      {
        src: "https://cdn.tailwindcss.com"
      },
      // @todo merge with users tailwind
      {
        innerHTML: `tailwind.config = {
  corePlugins: {
    preflight: false,
  }
}`
      }
    ],
    link: [
      {
        // reset css to match svg output
        href: "https://cdn.jsdelivr.net/npm/gardevoir",
        rel: "stylesheet"
      },
      // have to add each weight as their own stylesheet
      ...fonts.map((font) => {
        const [name, weight] = font.split(":");
        return {
          href: `https://fonts.googleapis.com/css2?family=${name}:wght@${weight}&display=swap`,
          rel: "stylesheet"
        };
      })
    ]
  });
  const headChunk = await renderSSRHead(head);
  return `<!DOCTYPE html>
<html ${headChunk.htmlAttrs}>
<head>${headChunk.headTags}</head>
<body ${headChunk.bodyAttrs}>${headChunk.bodyTagsOpen}<div style="position: relative; display: flex; margin: 0 auto; width: 1200px; height: 630px;">${island.html}</div>${headChunk.bodyTags}</body>
</html>`;
});

export { html as default };
//# sourceMappingURL=html.mjs.map
