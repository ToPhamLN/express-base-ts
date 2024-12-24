import { Server, Socket } from "socket.io";
import { USER_CONNECT, USER_DISCONNECT } from "../constants";

const onlineUsers: Map<string, Set<string>> = new Map();

export const getOnlineUsers = () => Array.from(onlineUsers.keys());

const userSocket = (io: Server, socket: Socket) => {
    socket.on(USER_CONNECT, (userId: string) => {
        const roomName = `room-${userId}`;
        socket.join(roomName);
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId)?.add(socket.id);
        io.emit(USER_CONNECT, Array.from(onlineUsers.keys()));
    });

    socket.on(USER_DISCONNECT, () => {
        for (const [userId, socketIds] of onlineUsers.entries()) {
            if (socketIds.has(socket.id)) {
                socketIds.delete(socket.id);
                if (socketIds.size === 0) {
                    onlineUsers.delete(userId);
                }
                break;
            }
        }
        io.emit(USER_CONNECT, Array.from(onlineUsers.keys()));
    });
};

export default userSocket;
