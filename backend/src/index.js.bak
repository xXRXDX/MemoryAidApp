import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { startInMemoryMongo } from './utils/db.js';

import userRoutes from './routes/userRoutes.js';
import questRoutes from './routes/questRoutes.js';

import moodRoutes from "./routes/mood.js";

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', userRoutes);
app.use('/api/quests', questRoutes);
app.use("/api/mood", moodRoutes);

// connect to DB: prefer MONGO_URI, else start in-memory
const MONGO_URI = process.env.MONGO_URI;
(async () => {
  try {
    if (MONGO_URI) {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB at', MONGO_URI);
    } else {
      const uri = await startInMemoryMongo();
      await mongoose.connect(uri);
      console.log('Connected to in-memory MongoDB');
    }
  } catch (err) {
    console.error('Mongo connection error:', err);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
