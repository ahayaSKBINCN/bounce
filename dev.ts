import * as path from "path";
import { WatchEventType, statSync, watch } from "fs";
import type { ServeOptions, ServerWebSocket } from "bun";

type GlobalThis = typeof globalThis & {
  socket: ServerWebSocket
}

const PROJECT_ROOT = import.meta.dir;
const PUBLIC_DIR = path.resolve(PROJECT_ROOT, "public");
const BUILD_DIR = path.resolve(PROJECT_ROOT, "outlet");

const pool: [WatchEventType, any][] = [];
const timeout = 1000
let timer: number | undefined = undefined

/**
 * @param type 
 * @param payload 
 */
const pushWatchResult = (type: WatchEventType, payload?: string) => {
  pool.push([type, payload])
  if (timer) clearTimeout(timer)
  timer = setTimeout(postMessage, timeout)
}

/**
 * ServerWebSocket post message
 * @param type 
 * @param payload 
 */
const postMessage = () => {
  const msg = []
  while (pool.length) {
    const item = pool.pop()!
    switch (item[0]) {
      case 'change':
      case "rename":
        msg.push(item[1])
        break;
      case "error":
      case "close":
        break
    }
  }
  if(msg.length) {
    const schema = new URLSearchParams()
    msg.forEach((payload, key) => {
      schema.append(`payload[${key}]`, payload)
    })

    tryToPostMessage('change', schema.toString())
  }
}

/**
 * ServerWebSocket try post message
 * @param {"change"} type 
 * @param {string} payload 
 * @param {Partial<string>} expected 
 * @returns 
 */
const tryToPostMessage = (type: WatchEventType, payload?: string, expected?: string) => {
  const _self: GlobalThis = global as any;
  try {
    if (!_self.socket) return
    return _self.socket.send(JSON.stringify({ type, payload }))
  } catch (e) {
    console.log(e)
    return
  }
}

/**
 * 
 */
const buildConfig: ParamOf<typeof Bun.build> = {
  entrypoints: ["./src/index.ts"],
  outdir: "./outlet",
  splitting: true,
  sourcemap: 'external',

};

await Bun.build(buildConfig);

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
    } catch (err) {
    }
  }

  return null;
}

/**
 * 
 */
const server = Bun.serve({
  fetch(request, server) {

    let reqPath = new URL(request.url).pathname;
    // fetch path is socket
    if (reqPath.startsWith('/ws'))
      if (server.upgrade(request)) {
        return
      }

    if (reqPath === "/") reqPath = "/index.html";

    // check public
    const publicResponse = serveFromDir({
      directory: PUBLIC_DIR,
      path: reqPath
    });
    if (publicResponse) return publicResponse;

    // check /.build
    const buildResponse = serveFromDir({ directory: BUILD_DIR, path: reqPath });
    if (buildResponse) return buildResponse;

    return new Response("File not found", {
      status: 404
    });
  },
  websocket: {
    message(ws, message) {
      console.log(message)
    },
    open(ws) {
      (globalThis as any).socket = ws
      console.log("open")
    },
    close() {
      (globalThis as any).socket = null
      console.log("close")
    },
    drain(ws) {
      console.log("drain")
    },
  }
});

/** 
 * watch.dir(src) changes, then emit(postMessage)
 *  */
watch("./src", { encoding: "buffer", recursive: true }, async (event, filename) => {
  console.log(event, filename?.toString());
  Bun.build(buildConfig).then(({outputs}) => {
    console.log(outputs)
    pushWatchResult(event, filename?.toString())
  });
});

console.log("import.meta.dir",import.meta.dir)

console.log(`Listening on http://localhost:${server.port}`)


