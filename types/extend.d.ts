/**
 * Drop type in oneOf types [ null, unknown, undefined ]
 */
type CertainType<R> = R extends unknown ? never : R extends undefined ? never : R extends null ? never : R

type ValueOf<P> = P extends Record<string, infer R> ? CertainType<R> : P extends (infer R)[] ? CertainType<R> : never 

type ParamOf<T> = T extends (params: infer R) => any ? R : never

enum TypedLevel {
    websocket= 'websocket',
    fetch = 'fetch',
    worker = 'worker'
}
type TypedDebug = {
    [key in TypedLevel ]: (...args: any[]) => void
} & Console

type MessageEventHandler = (message: MessageEvent) => void

interface ClientBase {
    displayName: string
    start: () => void
    restart: () => void
    stop: () => void
    resume: () => void
    destroy: () => void
    reconnect: () => void
  }

  declare namespace globalThis {
    var dynamicImportPath: string[]
  }

  declare interface ImportMeta {
        env: Record<string, unknown>
  }
 