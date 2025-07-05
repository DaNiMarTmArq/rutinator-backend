// src/app.ts
import express from "express";
import cors from "cors";
import routes from "./routes/routes.index";
import { globalErrorHandler } from "./errors/error.handler";

const app = express();

const allowedOrigins = [
  "http://localhost:4200",
  "https://rutinator.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(globalErrorHandler);

export default app;
