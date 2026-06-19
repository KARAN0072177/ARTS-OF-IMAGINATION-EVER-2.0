import MongoStore from "connect-mongo";

const LOCAL_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5176",
  "http://localhost:4173",
];

export const isProduction = () => process.env.NODE_ENV === "production";

export const getAllowedOrigins = () => {
  const configuredOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS || "").split(","),
  ]
    .map((origin) => origin?.trim())
    .filter(Boolean);

  return [...new Set([...LOCAL_ORIGINS, ...configuredOrigins])];
};

export const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (getAllowedOrigins().includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS origin blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export const getSessionCookieName = () =>
  process.env.SESSION_COOKIE_NAME || "aoie.sid";

export const getSessionCookieOptions = () => ({
  secure: isProduction(),
  httpOnly: true,
  sameSite: isProduction() ? "none" : "lax",
  maxAge: Number(process.env.SESSION_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000,
});

export const getSessionClearCookieOptions = () => {
  const { maxAge, ...cookieOptions } = getSessionCookieOptions();
  return cookieOptions;
};

export const getSessionOptions = () => {
  if (isProduction() && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is required in production.");
  }

  const options = {
    name: getSessionCookieName(),
    secret: process.env.SESSION_SECRET || "development-session-secret",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: getSessionCookieOptions(),
  };

  if (process.env.MONGO_URI) {
    options.store = MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: process.env.SESSION_COLLECTION_NAME || "express_sessions",
      ttl: Math.ceil(getSessionCookieOptions().maxAge / 1000),
      autoRemove: "native",
    });
  }

  return options;
};
