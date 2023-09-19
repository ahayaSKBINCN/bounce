type ParamOf<T> = T extends (params: infer R) => any ? R : never
declare interface Window {
    $RefreshSig$: Function;
    $RefreshReg$: Function;
    $RefreshServer$: WebSocket
}
