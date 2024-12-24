import { Socket } from "socket.io";
import { getSocket } from "@/configs";
import userSocket from "./users";

const connectWebSocket = () => {
    const io = getSocket();

    io.on("connection", (socket: Socket) => {
        userSocket(io, socket);
    });
};

export default connectWebSocket;
