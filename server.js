import express from "express";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import appRoutes from "./routes/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "/client/dist")));

// Middlewares
app.use(express.json());
app.use(cors());

// API routes
app.use("/api", appRoutes);

// Catch-all route for React frontend (serve index.html for non-API routes)
app.get("*", (req, res) => {
  if (!req.originalUrl.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "/client/dist/index.html"));
  }
});

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://ahmadsalemehas02:db9GTn3X2PpBVNya@cluster0.netsr.mongodb.net/salame_electric?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to DB successfully");
    // Start the server
    app.listen(5000, "localhost", () => console.log("Listening to port 5000"));
  })
  .catch((err) => console.log(err));
