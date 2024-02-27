import Bun from "bun"
import { resolve, join } from "node:path"
import { readFile } from "fs/promises"


const ROOT_DIR = resolve(import.meta.dir, "../src")

/** 对于每一个懒加载文件执行一次构建任务，done用于处理过滤重复构建的path */
export const microBuild = (entries: EntryPath[], configuration: Bun.BuildConfig) => {
    const tasks = [];
    for(let i = 0; i<entries.length; i++) {
        const targetFileName = /([^\/]+.ts(x)?)/.exec(entries[i].value)?.[0]?.replace(/ts(x)$/, "js") || ''
        const dirPath = entries[i].value.replace(/([^\/]+.ts(x)?)/,'') // remove suffix
        const targetDir = join("./outlet", dirPath.replace(ROOT_DIR, ""))

        const task = readFile(entries[i].value, { encoding: "utf-8" })
        .then(transpiler)
        .then((source) => Bun.write(join(targetDir, targetFileName), source))
        tasks.push(task)
    }
    return Promise.allSettled(tasks)
}


type EntryPath = {
    value: string
}


let Transpiler: Bun.Transpiler | undefined = undefined

const getTranspiler = () => {
    return Transpiler || (Transpiler = new Bun.Transpiler({ loader: 'tsx' }))
}

const transpiler = (source: StringOrBuffer) => {
    getTranspiler().scanImports(source)
    return getTranspiler().transform(source)
    
}