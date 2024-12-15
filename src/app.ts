import express, { Request, Response } from "express";
import connectDB from "./config/database";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

// CORS options
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Optipro is running very fast!");
});

import storeRouter from "../src/controllers/store.controller";
app.use('/store', storeRouter);

import orderRouter from "../src/controllers/orders.controller";
app.use('/order', orderRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
