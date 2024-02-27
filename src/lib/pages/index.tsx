import { Fragment, lazy } from "react"
import { dynamic } from "../macros/dynamic" with { type: 'macro' }
import { Loadable } from "../components/Loadable"

export default () =>{ 
 return <Fragment>
    hello world!
    <Loadable target={dynamic("/lib/pages/component")}/>
 </Fragment>
}