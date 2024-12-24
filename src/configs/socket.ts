import { Server } from "socket.io";
import { corsOptions } from "./server";

let io: Server | null = null;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: corsOptions,
    });
    if (!io) {
        console.error("Socket is not initialized");
        process.exit(1);
    }
    console.log("[Socket]: Socket is initialized");
};

export const getSocket = () => {
    if (!io) throw new Error("Socket is not initialized");
    return io;
};
