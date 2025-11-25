import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import userRoutes from "./routes/userRoutes.js";
import questRoutes from "./routes/questRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/auth", userRoutes);
app.use("/quest", questRoutes);

// MONGO CONNECT
mongoose.connect(process.env.MONGO_URI, {
  dbName: "memoryapp",
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("Mongo connection error:", err));

// SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
