import React from 'react'
import { createRoot } from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
    createRoutesFromElements,
} from "react-router-dom"

import { routes } from "./routes"

type Routes = typeof routes


const routeTraveler = (routes: Routes) => {
    return routes.map((item, index) => {
        if (!item.children || !item.children.length) {
            return <Route key={item.path || '' + index} path={item.path} element={item.element}/>
        }
        return <Route key={item.path || '' + index} path={item.path}>
            {routeTraveler(item.children)}
        </Route>
        
    })
}
export const router = createBrowserRouter(createRoutesFromElements(routeTraveler(routes)))