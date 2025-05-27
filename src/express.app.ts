// src/app.ts
import express from "express";
import routes from "./routes/routes.index";
import { globalErrorHandler } from "./errors/error.handler";

const app = express();

app.use(express.json());
app.use("/api", routes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(globalErrorHandler);

export default app;
