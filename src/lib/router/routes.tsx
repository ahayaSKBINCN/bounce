import { RouteObject } from "react-router";
import { Loadable } from "./Loadable"

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <Loadable path="/lib/pages/index"/>

    }
]