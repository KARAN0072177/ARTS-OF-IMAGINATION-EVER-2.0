import dns from "dns";
import mongoose from "mongoose";

const DEFAULT_DNS_SERVERS = ["8.8.8.8", "8.8.4.4"];

const getDnsServers = () => {
  const configuredServers = process.env.DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  return configuredServers?.length ? configuredServers : DEFAULT_DNS_SERVERS;
};

export const configureDns = () => {
  const dnsServers = getDnsServers();
  dns.setServers(dnsServers);
  console.log(`DNS resolvers set to: ${dnsServers.join(", ")}`);
};

export const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required to connect to MongoDB.");
  }

  configureDns();

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS) || 30000,
  });

  console.log("MongoDB connected");
};
