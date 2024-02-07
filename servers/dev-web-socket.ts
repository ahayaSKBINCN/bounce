import type { ServerWebSocket, WebSocketHandler } from "bun";

export class DevWebSocket<T = unknown> implements WebSocketHandler<T> {
  #websocket: ServerWebSocket<T>| undefined
  
  #pool: PayloadItem[] = []
  private constructor() {}
  
  #timer: number|null = null;

  static #instance: DevWebSocket | undefined

  static getInstance () {
    if (!this.#instance) {
      this.#instance = new DevWebSocket()
    }
    return this.#instance
  }
  message =(ws: ServerWebSocket<T>, message: string | Buffer) => {}

  drain = (ws: ServerWebSocket<T>) => {}

  open = (ws: ServerWebSocket<T>) => {
    this.#websocket = ws;
  }
  close = () => {
    this.#websocket = undefined;
  }
  
  // custom impl
  slice = () => {
    const payload = new Set();
    while (!!this.#pool.length) {
      const item = this.#pool.pop()!
      payload.add(`${item.key}:${item.value}`)
    }
    this.#websocket?.send(JSON.stringify(Array.from(payload)))
  }
  
  put = ( item: PayloadItem | PayloadItem[] ) => {
    if (Array.isArray(item)) {
      this.#pool.push(...item)
    }else {
      this.#pool.push(item)
    }
    if (this.#timer) {
      clearTimeout(this.#timer)
    }
    setTimeout(() => {
      this.slice()
      }, 500)
  }
}

interface PayloadItem {
  key: string,
  value: string,
}
