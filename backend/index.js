import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";
import bookingRouter from "./routes/booking.route.js";
import fs from "fs";   // 👈 add this

dotenv.config();

let port = process.env.PORT || 6000;
let app = express();

// ✅ ensure ./public exists before multer tries to use it
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public", { recursive: true });
  console.log("📂 Created ./public directory");
}

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["https://stayloft-mtdf.onrender.com", "http://localhost:5173"],
  credentials: true
}));

// ✅ optional: serve static files (if you want to access them from browser)
app.use("/public", express.static("public"));

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
app.use("/api/booking", bookingRouter);

app.listen(port, () => {
  connectDb();
  console.log(`🚀 Server started on port ${port}`);
});
