async function _internal (opts: FactoryOptions) {
    const fs = await import('node:fs')
    const path = await import('node:path')
    await Bun.sleep(100)
    // const projectPath = 
    const fileEntryWatcher = fs.watch(import.meta.dir)
}


interface FactoryOptions {
    entries: string[];
    split?: boolean;
}

const defaultOpts: Required<FactoryOptions> = {
    entries: ['src/index.ts'],
    split: false
}

export const Factory = _internal