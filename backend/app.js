import { errorMiddleware } from "../backend/middlewares/errors.js";
import express from "express";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import patternRoute from "./routes/patternRoute.js";
import postRoute from "./routes/postRoute.js";
import cookieParser from "cookie-parser";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { configureSocket } from "./config/socket.js";
import askAIRoute from "./routes/askAIRoute.js";
import { initializePostCache } from "./utils/userInteractedPosts.js";
import http from "http";
const app = express();

const httpServer = http.createServer(app);
const io = configureSocket(httpServer);

app.use(
  cors({
    origin: [
      "http://192.168.18.36:5173",
      "http://localhost:5173",
      "http://192.168.x.x:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  req.io = io;
  next();
});

//initlaizing cache

//importing all the routes

app.use("/api/v1", chatRoute);
app.use("/api/v1", messageRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", patternRoute);
app.use("/api/v1", postRoute);
app.use("/api/v1", askAIRoute);

app.use(errorMiddleware);
export { app, httpServer };
