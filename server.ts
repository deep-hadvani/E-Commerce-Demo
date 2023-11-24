// server.ts
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './src/app';

dotenv.config();

const port = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

mongoose
  .connect(MONGODB_URL as string)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });   