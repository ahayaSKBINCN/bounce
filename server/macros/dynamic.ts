import { default as nodePath } from "node:path"
// import Bun from "bun"
import fs from "node:fs"
// import {cwd} from "node:process"
import { insert_definition } from "../dev/db"
// import { callerTrace } from "./callerTracePath"

const suffixReplace = (path: string) => {
    return path.replace(/\.ts(x)?$/, '.js')
}

const suffixAddon = (path: string) => {
    return path.endsWith(".js") ? path : `${path}.js`
}

export const dynamic = async function _(path: string) {
    // console.log(path, callerTrace())

    try {
    const target = suffixAddon(suffixReplace(path))

    // const dirPath = import.meta.dir;
    // const ROOT_DIR = <string>import.meta.env.npm_config_local_prefix;

    // const filePath = nodePath.join(dirPath, "../../src", `${path}.tsx`)
    // file test
    // fs.statSync(filePath)
    // after validate a real file located
    // insert_definition.run(JSON.stringify([filePath]))
    return target
    } catch (error) {
        return `DynamicBundleCheckingException: cannot resolve file with path ${path}`
    }
}


