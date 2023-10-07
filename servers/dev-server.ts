import type { ServeOptions, ServerWebSocket } from "bun";

/**
 * 
 */
export class DevServer {
    server: ServerWebSocket<unknown>;

    /**
     * 
     */
    constructor(server: ServerWebSocket<unknown>) {
      this.server = server
    }
}