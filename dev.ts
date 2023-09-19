import * as path from "path";
import { statSync, watch } from "fs";
import type { ServeOptions, ServerWebSocket } from "bun";

type GlobalThis = typeof globalThis & {
  socket: ServerWebSocket
}

const PROJECT_ROOT = import.meta.dir;
const PUBLIC_DIR = path.resolve(PROJECT_ROOT, "public");
const BUILD_DIR = path.resolve(PROJECT_ROOT, "outlet");

const postMessage = (type: string, dataset: any) => {
  const _self: GlobalThis = global as any;
  if (_self.socket)
  return _self.socket.send(JSON.stringify({ type, dataset }))
} 

const buildConfig: ParamOf<typeof Bun.build> = {
  entrypoints: ["./src/index.ts"],
  outdir: "./outlet",
  splitting: true,
  sourcemap: 'inline'
};

await Bun.build(buildConfig);

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

const server = Bun.serve({
  fetch(request, server) {
  
    let reqPath = new URL(request.url).pathname;
    // fetch path is socket
    if (reqPath.startsWith('/ws'))
      if(server.upgrade(request)){ 
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
    open(ws){
      (globalThis as any).socket = ws
      console.log("open")
    },
    close(){
      (globalThis as any).socket = null
      console.log("close")
    },
    drain(ws) {
      console.log("drain")
    },
  }
});

/** watch dir */
watch("./src", { encoding: "buffer", recursive: true }, async (event, filename) => {
  console.log(event, filename?.toString());
  Bun.build(buildConfig).then(() => {
    postMessage(event, filename)
  });
});


console.log(`Listening on http://localhost:${server.port}`);
