import { type Options as SwcOptions, transformFile } from "@swc/core"
import { type BunPlugin } from "bun"
import { merge } from "lodash"

type SwcPluginOptions = {
    swc?: SwcOptions
}

export const SwcPlugin = (options?: SwcPluginOptions): BunPlugin => ({
name: 'bun-plugin-swc',
setup: (build) => {
    build.onLoad({ filter: /\.ts(x)?$/ }, async ({ path, namespace }) => {
        const outlet = await transformFile(path, merge(options?.swc, {
            jsc: {
              keepClassNames: true,
              parser: {
                decorators: true,
                dynamicImport: false,
                syntax: 'typescript',
              },
              preserveAllComments: true,
              target: 'esnext',
              transform: {
                decoratorMetadata: true,
                legacyDecorator: true
              }
            },
            module: {
              type: 'es6'
            }
          } satisfies SwcOptions));
        console.log( path, outlet)

        return {
            contents: outlet.code,
            loader: 'js',
        }
    })
},

})