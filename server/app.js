import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import authRouter from "./router/authRoutes.js";
import productRouter from "./router/productRoutes.js";

const app = express();

config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    tempFileDir: "./uploads",
    useTempFiles: true,
  })
);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "Server is working",
    timestamp: new Date().toISOString()
  });
});

// API Routes - only essential ones
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);

// Lazy load other routes on demand
app.use("/api/v1/admin", async (req, res, next) => {
  try {
    const module = await import("./router/adminRoutes.js");
    return module.default(req, res, next);
  } catch (error) {
    console.error("Error loading admin routes:", error);
    res.status(500).json({ error: "Service unavailable" });
  }
});

app.use(errorMiddleware);

export default app;
