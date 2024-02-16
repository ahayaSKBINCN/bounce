import { Suspense, lazy } from "react"
import { isPath } from "../utils/is"

export const Loadable = ({ target }: { target: string | Promise<string> }) => {
    if (isPath(target as string)) {
        const LazyComponent = lazy(() => import(target as string))
        return <Suspense fallback="loading..." >
            <LazyComponent/>
        </Suspense>
    }
    return target as string
}