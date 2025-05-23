// src/app.ts
import express from "express";
import routes from "./routes/routes.index";

const app = express();

app.use(express.json());
app.use("/api", routes);

export default app;
