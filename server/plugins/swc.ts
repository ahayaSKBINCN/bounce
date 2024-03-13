import { type Options as SwcOptions, transformFile } from "@swc/core"
import { Import, type BunPlugin } from "bun"
import { merge } from "lodash"
import { read, readFile, readFileSync, readSync, stat, statSync } from "node:fs"
import { readdirSync } from "node:fs"
import * as nodePath from "path"

type SwcPluginOptions = {
    swc?: SwcOptions
}

const transpiler = new Bun.Transpiler({ loader: 'tsx' })


export const SwcPlugin = (options?: SwcPluginOptions): BunPlugin => ({
name: 'bun-plugin-swc',
setup: (build) => {
    build.onLoad({ filter: /\.ts(x)?$/ }, async ({ path }) => {
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
        const { imports } = transpiler.scan(outlet.code)
        const dirPath = path.replace(/[^\/]+\.ts(x)?$/, '')
        // readSync(dirPath, (res) => console.log(res) )
        // const dirUnion = await readdir(dirPath, { withFileTypes: true })
        // dirUnion.forEach((dirent) => console.log(nodePath.join(dirPath, dirent.name), dirent.isFile()) )
        // dirent.map((fileName)=> stat(nodePath.join(dirPath, fileName), {  }).then(console.log))
        // const moduleSource = transpiler.scan(outlet.code)
        loopModules(imports, dirPath).next((vvi: string[]) => console.log(vvi))
        return {
            contents: outlet.code,
            loader: 'js',
        }
    })
},

})


const loopModules = (imports: Import[], dirPath: string) => {
  const paths: string[] = []
  imports.forEach(({ path }) => {
    
    let target, index = 0, filePath = nodePath.join(dirPath, path);
    while(!target && index< suffix.length) {
      try {
        target = statSync(`${filePath}${suffix[index]}`, { throwIfNoEntry: true })
        if (index === 0) {
          const dirent = readdirSync(filePath, { withFileTypes: true })
          
          console.log( 'dirent', dirent)
          filePath = filePath + "/index"
          
          try {
            console.log('--------------', readdirSync(`${filePath}${suffix[4]}`))
          } catch (error) {
            console.log(error)
          }
          target = statSync(`${filePath}${suffix[index]}`)
        }
        paths.push(`${filePath}${suffix[index]}`)
      } catch (error) {
        index++
      }
    }
    
    

  });

  return {
    next: (callback?: any) => callback?.call(void 0, paths) 
  }
}

/** index = 0 为特殊格式的文件 */
const suffix = ['', ".js", '.jsx', '.ts', '.tsx']