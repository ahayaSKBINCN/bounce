import { RouteObject } from "react-router";
import { dynamic } from "../macros/dynamic" with { type: 'macro' };
import { createElement } from "react";
import { Loadable } from "../components/Loadable";

export const routes: RouteObject[] = [
    {
        path: '/',
        // element: <Loadable path="/lib/pages/index"/>
        element: <Loadable target={dynamic("/lib/pages/index")}/>

    }
]