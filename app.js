import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;

//Importing Database
import connectDB from "./config/connectDB.js";
const DATABASE_URL = process.env.DATABASE_URL;

import userRoutes from "./routes/userRoutes.js";

import cors from "cors";

//CORS policy
app.use(cors());

//Database Connection
connectDB(DATABASE_URL);

//JSON
app.use(express.json());

//Load Routes
app.use("/api/user", userRoutes);

app.listen(port, (err) => {
  if (err) {
    console.log("Error Occured and this is error " + err);
  } else {
    console.log("Sever is running fine");
  }
});
