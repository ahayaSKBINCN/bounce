import { Suspense, lazy } from "react"
// import { suffixAddon, suffixReplace } from "../macros/dynamic" with { type: 'macro' }

export const Loadable = ({ path }: { path: string }) => {
    import (suffixAddon(suffixReplace(path))).then(console.log).catch(console.warn)

    // import succeed but real file is not in bundle dist 
    const Component = lazy(() =>import(suffixAddon(suffixReplace(path))))
    return <Suspense fallback="loading...">
        <Component/>
    </Suspense>
}

export const suffixReplace = (path: string) => {
    return path.replace(/\.ts(x)?$/, '.js')
}

export const suffixAddon = (path: string) => {
    return path.endsWith(".js") ? path : `${path}.js`
}