import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import path from "path";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import subUserRoutes from "./routes/subUserRoutes.js";
import uploadFileRoutes from "./routes/Manage Application/uploadFileRouters.js";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();



connectDB();

const app = express(); // main thing
app.use(cors());
// app.use(cors({origin: 'https://websyetem.online'}));http://localhost:5000/
app.use(express.json()); // to accept json data


app.use("/api/users", userRoutes);
app.use("/api/subUsers", subUserRoutes);


// Manage Application
app.use("/api/uploadFiles", uploadFileRoutes);


// --------------------------deployment------------------------------
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("Emails API is running..");
  });
}
// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5888;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}..`.yellow
      .bold
  )
);



  // "type": "module",
