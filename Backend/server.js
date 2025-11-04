    import express from "express";
    import dotenv from "dotenv";
    import cors from "cors";
    import cookieParser from "cookie-parser";
    import connectDB from "./config/db.js";
    import commentRoutes from "./routes/commentRoutes.js";
    import userRoutes from "./routes/userRoutes.js";
    import photoRoutes from "./routes/photoRoutes.js";

    dotenv.config();
    const app = express();
    connectDB();

    // ✅ Middleware
    app.use(express.json());
    app.use(cookieParser());
    app.use(
    cors({
        origin: "http://localhost:5173", // your React app URL
        credentials: true, // allow sending cookies
    })
    );

    // ✅ Routes
    app.use("/api/users", userRoutes);
    app.use("/api/photos", photoRoutes);
    app.use("/api/comments", commentRoutes);

    // Serve uploaded images
    app.use("/uploads", express.static("uploads"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
