// import chalk from "chalk";

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

/**
 * state flow
 */
enum DevClientStatus {
  dashed,
  growing,
  dead,
  ashed,
}

interface WebSocketClientProperties {
  pathname: string;
  protocol: string;
  host: string;
}

type WSClientProps = WebSocketClientProperties;
// define development
export const __DEV__ = process.env.NODE_ENV === "development";

const DEBUG_LEVEL: string[] = ["websocket", "fetch", "worker"];

export class WebSocketClient implements ClientBase {
  displayName = "WebSocketClient";
  #client: WebSocket | null = null;
  #ws_path: string;

  #status: DevClientStatus;

  #queue = new Proxy<Record<string, any[]>>(
    {},
    {
      get(target: any, p): any[] {
        if (!Object.hasOwn(target, p)) {
          target[p] = [];
        }
        return target[p];
      },
    }
  );

  static #internalDebug = (...content: any[]) => {
    // const formats = chalk.red(...content)
    // console.log(formats)
  };

  static debug = <TypedDebug>new Proxy(window.console, {
    get: function __getter(target, prop: string, receiver) {
      if (DEBUG_LEVEL.includes(prop.toLocaleLowerCase()) && __DEV__) {
        return WebSocketClient.#internalDebug.bind(
          WebSocketClient,
          `[${prop.toLocaleUpperCase()}]`
        );
      }
      return Reflect.get(target, prop);
    },
  });

  static #validateProtocol = (protocol: string) => {
    if (!["ws://", "wss://"].includes(protocol)) {
      throw new Error(
        " Expected value of property `protocol` must be oneOf [`ws://`, `wss://`], but got " +
          protocol
      );
    }
  };

  static #validateHost = (host: string) => {
    if (!/\d{1,3}\.\d{1,3}\.\d{1,3}/.exec(host) || host !== "localhost") {
      throw new Error(
        " Expected value of property `host` must be valid ip address, such as `0.0.0` or special domain `localhost`, but got " +
          host
      );
    }
  };

  constructor({ pathname, protocol, host }: WSClientProps) {
    WebSocketClient.#validateProtocol(protocol);
    // WebSocketClient.#validateHost(host)

    const path = `${protocol}${host}/${pathname}`;

    this.#ws_path = path;
    this.#status = DevClientStatus.dashed;
    this.#client = new WebSocket(path);
  }

  #connect() {
    this.#client = new WebSocket(this.#ws_path);
    this.#client.onopen = this.onopen.bind(this);
    this.#client.onclose = this.onclose.bind(this);
    this.#client.onerror = this.onerror.bind(this);
    this.#client.onmessage = this.onmessage.bind(this);
  }

  restart() {}

  stop() {}

  resume() {}

  destroy() {}

  start() {
    this.#connect();
  }

  /**
   * try to recreate websocket connect while some
   * */
  reconnect = () => {
    debug.websocket("[RECONNECT]");
    try {
      this.#connect();
    } catch (error) {
      setTimeout(() => {
        this.reconnect();
      }, 500);
    }
  };

  onopen = () => {
    debug.websocket("[OPEN] RefreshServer Listened on: " + this.#ws_path);
    this.#status = DevClientStatus.growing;
  };

  onerror = (event: Event<EventTarget>) => {
    this.#status = DevClientStatus.dead;
    debug.websocket("[ERROR] ", event);
  };

  onclose = (event: Event) => {
    this.#status = DevClientStatus.ashed;
    debug.websocket("[CLOSE] ");
    this.reconnect();
  };

  onmessage = (event: MessageEvent) => {
    debug.websocket(
      "[MESSAGE] ",
      event.data,
      isBrowser,
      typeof globalThis.location.reload
    );
    // TODO next step use `hot-reload` api instead of `globalThis.location.reload`
    const url = new URL("http://localhost:3000")
    url.pathname = "index.js"
    fetch(url).then(response => response.text()).then((blob) => new Function(blob).apply(window) )

//    try {
//      const params = JSON.parse(event.data);
//      if (params && params.payload) {
//          const schema = Array.from(new URLSearchParams(params.payload)).map(s => s[1])
//        const url = new URL("http://localhost:3000")
//        url.pathname = "index.js"
//        fetch(url).then(response => response.text()).then(eval)
//      }
//    } catch {
//      if (typeof globalThis.location?.reload === "function") {
//        window.location.reload();
//      }
//    }
  };
  on = (
    eventName: string,
    callback: MessageEventHandler,
    once: boolean = false
  ) => {
    const listeners = this.#queue[eventName];
    listeners.push(
      once ? <MessageEventHandler>((message) => {
            callback.call(void 0, message);
            listeners.splice(listeners.indexOf(callback), 1);
          }) : callback
    );

    return function remove() {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };
  once = (eventName: string, callback: MessageEventHandler) => {
    return this.on(eventName, callback, true);
  };
}

window.debug = WebSocketClient.debug;
