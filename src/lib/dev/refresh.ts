import { WebSocketClient, __DEV__ } from "./websocket-client"

const devClient = new WebSocketClient({
    protocol:'ws://',
    pathname: `ws`,
    host:"localhost:3000"
})

devClient.start()
