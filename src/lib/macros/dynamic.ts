export const suffixReplace = (path: string) => {
    return path.replace(/\.ts(x)?$/, '.js')
}

export const suffixAddon = (path: string) => {
    return path.endsWith(".js") ? path : `${path}.js`
}