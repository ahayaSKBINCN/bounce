import Bun from "bun"
import { resolve, join } from "node:path"

const ROOT_DIR = resolve(import.meta.dir, "../src")

/** 对于每一个懒加载文件执行一次构建任务，done用于处理过滤重复构建的path */
export const microBuild = (entries: EntryPath[], configuration: Bun.BuildConfig) => {
    const tasks = [];
    for(let i = 0; i<entries.length; i++) {
        const dirPath = entries[i].value.replace(/([^\/]+.tsx)/,'') // remove suffix
        console.log('reg', entries[i].value)
        const outdir = join("./outlet", dirPath.replace(ROOT_DIR, ""))
        tasks.push(Bun.build({
            ...configuration,
            entrypoints: [entries[i].value],
            outdir,
        }))
    }
    return Promise.allSettled(tasks)
}


type EntryPath = {
    value: string
}