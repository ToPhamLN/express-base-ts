import { injectable } from "inversify";
import { Server } from "socket.io";
import { corsOptions } from "./server";
import http from "http";

@injectable()
export class SocketConfig {
    private instance: Server | null = null;

    public init(server: http.Server) {
        if (!this.instance) {
            this.instance = new Server(server, {
                cors: corsOptions,
            });

            console.log("[Socket]: Socket is initialized");
        } else {
            console.warn("[Socket]: Socket is already initialized");
        }
    }

    public getInstance(): Server {
        if (!this.instance) {
            throw new Error("[Socket]: Socket is not initialized");
        }
        return this.instance;
    }

    public reset() {
        if (this.instance) {
            this.instance.close();
            this.instance = null;
            console.log("[Socket]: Socket is reset");
        }
    }
}
