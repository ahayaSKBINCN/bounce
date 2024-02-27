import Bun, { BunPlugin } from "bun";
import * as fs from "node:fs";
import * as NodePath from "node:path";

const ROOT_DIR = NodePath.resolve(import.meta.dir, "../../src");

export default <BunPlugin>{
  name: "css-module-loader",
  setup(builder) {
    const TAG = `["CSS-MODULE-LOADER"]`;

    console.log(TAG, "SETUP");
    builder.onResolve({ filter: /\.css$/ }, ({ path, ...rest }) => {
      console.log(TAG, "RESOLVE", path);
      if (/\.module\.css$/.exec(path)) {
        return {
          path,
          namespace: "css-module",
        };
      } else {
        return {
          path,
          namespace: "css",
        };
      }
    });
    builder.onLoad(
      { filter: /\.css$/, namespace: "css-module" },
      async ({ path }) => {
        console.log("module-css", path);
        const contents = await Bun.file(
          NodePath.resolve(ROOT_DIR, path)
        ).text();
        return {
          loader: "object",
          exports: {} as any,
        };
      }
    );
    builder.onLoad({ filter: /\.css$/, namespace: "css" }, async ({ path }) => {
      console.log("css", path);
      const contents = await Bun.file(NodePath.resolve(ROOT_DIR, path)).text();
      return {
        loader: "object",
        exports: {} as any,
      };
    });
  },
}; 

const postCSS = async function (cfg: Config) {
  const cssParser = (await import("postcss-value-parser")).default;
  if (!cssParser) {
    return Promise.reject("....error....")
  }
  const parsed = cssParser.call(void 0, cfg.value)
  parsed.walk(function _walked(node) {

  });

};

type Config = {
  type: 'css'|'css-module',
  value: string
}
