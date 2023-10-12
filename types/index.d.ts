declare interface Window {
    $RefreshSig$: Function;
    $RefreshReg$: Function;
    $RefreshServer$: WebSocket
    debug: TypedDebug
    devClient: DevClient
}

declare module "*.module.css"

declare const debug: TypedDebug;