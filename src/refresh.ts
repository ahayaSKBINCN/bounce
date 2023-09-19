// define development
const __DEV__ = process.env.NODE_ENV === "development"

const DEBUG_LEVEL = ["websocket", "fetch", "worker"]

const WS_PATH = "ws://localhost:3000/ws" 

// In old environments, we'll leak previous types after every edit.
const PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;

const __DEBUG__ = <TypedDebug><unknown>new Proxy(window.console, {
    get: function (target, prop: string, receiver) {
        console.log(target, prop)
        if (DEBUG_LEVEL.includes(prop.toLocaleLowerCase())) {
            return console.log.bind(window.console, `%c[${prop.toLocaleUpperCase()}]`,`color:${getRandomColor()};font-weight:bold;`)
        }
        return Reflect.get(target, prop)
    }
})

if (__DEV__) {
    const socket = new WebSocket(WS_PATH)
    socket.onopen = function (ev) { 
        __DEBUG__["websocket"]("[OPEN]\rRefreshServer Listened on: "+ WS_PATH)
     }
    socket.onerror = function (error) {
        __DEBUG__['websocket']('[ERROR]\r', error)
    }
    socket.onclose = function (error) {
        __DEBUG__['websocket']('CLOSE\r')
    }
    socket.onmessage = function (message) {}
}

const register = function (type: any, id: string): void {
    if (__DEV__) {
        if (type === null) return
        if (typeof type !== "function" && typeof type !== "object" ) return;

    }

}


const __COLOR_SET__ = [
    "#f9ebea",
    "#a93226",
    "#ec7063",
    "#af7ac5",
    "#bb8fce",
    "#85c1e9",
    "#1abc9c",
    "#2980b9",
    "#17a589",
    "#16a085",
    "#229954",
    "#2ecc71",
    "#f1c40f",
    "#d68910",
    "#f8c471",
    "#ca6f1e",
    "#873600",
    "#212f3c",
]


const getRandomColor = () => {
    return <string> __COLOR_SET__.at(Math.random() * __COLOR_SET__.length)
}


type TypedDebug = {
    [key: string]: (...args: any[]) => void
}

