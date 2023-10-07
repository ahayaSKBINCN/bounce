declare interface Window {
    $RefreshSig$: Function;
    $RefreshReg$: Function;
    $RefreshServer$: WebSocket
    debug: TypedDebug
    devClient: DevClient
}

declare const debug: TypedDebug;