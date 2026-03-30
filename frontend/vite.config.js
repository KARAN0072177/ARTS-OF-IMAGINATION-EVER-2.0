import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import csp from 'vite-plugin-csp';

export default defineConfig({
  plugins: [
    react(),
    csp({
      policy: {
        'default-src': ["'self'"],
        'script-src': [
          "'self'",
          "http://localhost:5173",
          "https://www.google.com",
          "https://www.gstatic.com",
          "https://js.stripe.com",  // ✅ allow Stripe scripts
          "'unsafe-inline'"
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com"
        ],
        'style-src-elem': [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com"
        ],
        'font-src': ["'self'", "https://fonts.gstatic.com"],
        'img-src': ["*"], // ✅ Allows images from any domain
        'connect-src': [
          "'self'",
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:5176",
          "http://localhost:5000",
          "wss://aoie-backend.onrender.com",
          "https://aoie-backend.onrender.com",
          "ws://localhost:5000",
          "wss://localhost:5000",
          "https://www.google.com",
          "https://www.gstatic.com",
          "https://i.ibb.co",
          "https://i.postimg.cc", // ✅ Added Postimg for image requests
          "https://api.stripe.com",
        ],
        'frame-src': ["'self'", "https://www.google.com", "https://hooks.stripe.com", "https://js.stripe.com"],
      },
    }),
  ],
});