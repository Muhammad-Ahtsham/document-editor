import express from "express";
import { configDotenv } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from "./config/connectDb";
import DocContentRoutes from "./routes/docContent";
import DocumentRouter from './routes/document';
import liveblocksRouter from './routes/liveblocks';
import UserRoutes from "./routes/user";
const app = express();
configDotenv();
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
connectDb();
app.use("/user", UserRoutes);
app.use("/docContent", DocContentRoutes);
app.use("/document", DocumentRouter);
app.use('/liveblocks', liveblocksRouter)
app.get("/", (_req, res) => {
  res.send("Express + TypeScript (global TS)");
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port 3000");
});
