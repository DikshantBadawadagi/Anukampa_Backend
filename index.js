import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ApiError from "./error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import imageRoutes from "./routes/images.js";
import ngoRoutes from "./routes/ngoUser.js";
import volunteerRoutes from "./routes/volunteer.js";

dotenv.config();

const app = express();

const connect = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.log(error);
    })
};

const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/videos", videoRoutes);
// app.use("/api/comments", commentRoutes);
app.use("/api/uploadImage", imageRoutes);
app.use("/ngo", ngoRoutes);
app.use("/volunteer", volunteerRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    connect();
    console.log(`Backend server is running on ${process.env.PORT}`)
})