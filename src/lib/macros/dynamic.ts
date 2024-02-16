import { createElement, lazy, Suspense } from "react"


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
    const nodePath = await import("node:path")
    const fs = await import("node:fs")
    const ROOT_DIR = <string>import.meta.env.npm_config_local_prefix;

    const filePath = nodePath.join(dirPath, "../../", `${path}.tsx`)

    await Bun.write(nodePath.join(ROOT_DIR, "node_modules/.bin/@cache"), `${filePath}\r\n`)
    // file test
    fs.statSync(filePath)
    const source = nodePath.resolve(dirPath, "../../", path); // src/*
    return target
    } catch (error) {
        console.log(error)
        return `DynamicChunkBundleException: cannot resolve file with path ${path}`
    }
}


