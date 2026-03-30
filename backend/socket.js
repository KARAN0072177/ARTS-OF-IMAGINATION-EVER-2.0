import { Server } from "socket.io";
import { getAdminStats } from "./utils/adminStats.mjs"; // Helper function for stats

let io; // Declare io variable to be used in routes

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173" , "http://localhost:4173"], // Adjust if needed
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    console.log("🔌 WebSocket connected:", socket.id);

    // Send initial stats when an admin connects
    const stats = await getAdminStats();
    socket.emit("adminStatsUpdate", stats);

    socket.on("disconnect", () => {
      console.log("❌ WebSocket disconnected:", socket.id);
    });
  });
};

export const emitAdminStatsUpdate = async () => {
  if (io) {
    const updatedStats = await getAdminStats();
    io.emit("adminStatsUpdate", updatedStats);
  }
};