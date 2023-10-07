import { WebSocketClient, __DEV__ } from "./websocket-client"

const REACT_MEMO_TYPE: Symbol = Symbol.for("react.memo");
const REACT_FORWARD_REF_TYPE: Symbol = Symbol.for("react.forward_ref");
// In old environments, we'll leak previous types after every edit.
const PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;

const devClient = new WebSocketClient({
    protocol:'ws://',
    pathname: `ws`,
    host:"localhost:3000"
})

