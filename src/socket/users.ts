import { injectable, inject } from "inversify";
import { TYPES } from "@/constants";
import { AppContextService } from "@/services";
import { Server, Socket } from "socket.io";
import { USER_CONNECT, USER_DISCONNECT } from "../constants";

@injectable()
export class UserSocket {
    constructor(
        @inject(TYPES.AppContextService)
        private readonly _appContextService: AppContextService
    ) {}

    public async init(io: Server, socket: Socket) {
        await this.userConnect(io, socket);
        await this.userDisconnect(io, socket);
    }

    public async userConnect(io: Server, socket: Socket) {
        socket.on(USER_CONNECT, (userId: string) => {
            const roomName = `room-${userId}`;
            socket.join(roomName);
            this._appContextService.setUserOnline(userId, socket.id);
            io.emit(USER_CONNECT, this._appContextService.getUsersOnline());
        });
    }

    public async userDisconnect(io: Server, socket: Socket) {
        socket.on(USER_DISCONNECT, () => {
            this._appContextService.removeUserOnline(socket.id);
            io.emit(USER_CONNECT, this._appContextService.getUsersOnline());
        });
    }
}
