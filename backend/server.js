import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import contentRoutes from "./routes/contentRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

app.disable("x-powered-by");

app.use(helmet());

const envOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:3000",
  ...envOrigins,
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      const normalized = origin.replace(/\/+$/, "");
      const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalized);
      if (allowedOrigins.has(normalized) || isVercelPreview) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Content Generator API is running.",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
  });
});

const contentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many content requests. Please try again later.",
  },
});

app.use("/api/content", contentLimiter, contentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// Error-handling middleware comes first
app.use(errorHandler);

// 404 fallback comes after routes and errorHandler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`AI Content Generator API running on port ${PORT}`);
  });
}

export default app;
