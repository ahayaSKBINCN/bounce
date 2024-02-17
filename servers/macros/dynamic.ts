import { default as nodePath } from "node:path"
import fs from "node:fs"
import { insert_definition } from "../db"

const suffixReplace = (path: string) => {
    return path.replace(/\.ts(x)?$/, '.js')
}

const suffixAddon = (path: string) => {
    return path.endsWith(".js") ? path : `${path}.js`
}

export const dynamic = async function _(path: string) {
    try {
    const target = suffixAddon(suffixReplace(path))

    const dirPath = import.meta.dir;
    // const ROOT_DIR = <string>import.meta.env.npm_config_local_prefix;

    const filePath = nodePath.join(dirPath, "../../src", `${path}.tsx`)
    console.log('filePath', filePath)
    // file test
    fs.statSync(filePath)
    // after validate a real file located
    insert_definition.run(JSON.stringify([filePath]))

    
    return target
    } catch (error) {
        console.log(error)
        return `DynamicChunkBundleException: cannot resolve file with path ${path}`
    }
}