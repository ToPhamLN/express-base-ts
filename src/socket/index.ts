import { Server, Socket } from "socket.io";
import { inject, injectable } from "inversify";
import { SocketConfig } from "@/configs";
import { TYPES } from "@/constants";
import { UserSocket } from "./users";

@injectable()
export class SocketHandlers {
    private io: Server;

    constructor(
        @inject(TYPES.SocketConfig) private _socketConfig: SocketConfig,
        @inject(TYPES.UserSocket) private _userSocket: UserSocket
    ) {
        this.io = this._socketConfig.getInstance();
        this.setupDefaultHandlers();
    }

    private setupDefaultHandlers() {
        console.log("[Socket]: Socket is listenning.");
        this.io.on("connection", (socket: Socket) => {
            this._userSocket.init(this.io, socket);
        });
    }
}

export * from "./users";
