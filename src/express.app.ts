// src/app.ts
import express from "express";
import cors from "cors";
import routes from "./routes/routes.index";
import { globalErrorHandler } from "./errors/error.handler";

const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
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
