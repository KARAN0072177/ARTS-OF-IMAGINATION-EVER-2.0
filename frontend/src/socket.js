import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true, // include cookies if your socket auth uses sessions
});

export default socket;