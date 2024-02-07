import * as path from "path";
import { statSync, watch } from "fs";
import { default as CSSPlugin } from "./servers/plugins/css-module"


import { DevWebSocket } from "./servers/dev-web-socket";


const PROJECT_ROOT = import.meta.dir;
const PUBLIC_DIR = path.resolve(PROJECT_ROOT, "public");
const BUILD_DIR = path.resolve(PROJECT_ROOT, "outlet");

const ignore = ["sourcemap"];

/** 资源缓存列表 */
const hashmap = new Map<string, string>();
const buildConfig: ParamOf<typeof Bun.build> = {
  entrypoints: ["./src/index.ts"],
  outdir: "./outlet",
  splitting: true,
  sourcemap: "external",
  plugins: [CSSPlugin]
};

await Bun.build(buildConfig).then((outlet) => {
  outlet.outputs
    .filter((once) => !ignore.includes(once.kind))
    .forEach((once) => {
      hashmap.set(once.path.replace(BUILD_DIR, ""), once.hash!);
    });
  return outlet;
});

/**
 * @param config
 * @returns
 */
function serveFromDir(config: {
  directory: string;
  path: string;
}): Response | null {
  let basePath = path.join(config.directory, config.path);
  const suffixes = ["", ".html", "index.html"];

  for (const suffix of suffixes) {
    try {
      const pathWithSuffix = path.join(basePath, suffix);
      const stat = statSync(pathWithSuffix);
      if (stat && stat.isFile()) {
        return new Response(Bun.file(pathWithSuffix));
      }
    } catch (err) {}
  }

  return null;
}

function handleFetch(request: Request, server: ReturnType<typeof Bun.serve>) {
  let path = new URL(request.url).pathname;
  if (path.startsWith("/ws")) if (server.upgrade(request)) return;
  if (path === "/") path = "/index.html";
  const publicResponse = serveFromDir({
    directory: PUBLIC_DIR,
    path,
  });
  if (publicResponse) return publicResponse;
  // check /.build
  const buildResponse = serveFromDir({
    directory: BUILD_DIR,
    path,
  });
  if (buildResponse) return buildResponse;

  return new Response("File not found", {
    status: 404,
  });
}



const getServer = () => {
  return new Promise((resolve, reject) => {
    resolve(
      Bun.serve({
        fetch: handleFetch,
        websocket: DevWebSocket.getInstance(),
      })
    );
  });
};

const server = Bun.serve({
  fetch: handleFetch,
  websocket: DevWebSocket.getInstance(),
});

/**
 * watch.dir(src) changes, then emit(postMessage)
 *  */
watch(
  "./src",
  { encoding: "buffer", recursive: true },
  async (event, filename) => {
    Bun.build(buildConfig).then((outlet) => {
      const { outputs } = outlet;
      const diff = outputs.filter((once) => {
        if (!ignore.includes(once.kind)) {
          const path = once.path.replace(BUILD_DIR, "");
          if (!hashmap.has(path) || hashmap.get(path) !== once.hash) {
            hashmap.set(path, once.hash!);
            return true;
          }
        }
        return false;
      });
      DevWebSocket.getInstance().put({ key: event, value: filename?.toString() || '' })
      return outlet;
    });
  }
);

console.log(`Listening on http://localhost:${server.port}`);
