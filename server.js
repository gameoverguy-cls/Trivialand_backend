import { config } from "dotenv";
config(); // 👈 FIRST LINE that runs

import express from "express";
import connectDB from "./src/config/db.js";
import cors from "cors";

const app = express();
const PORT = 5001;

connectDB();

import questionRoutes from "./src/routes/questionRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import subCategoryRoutes from "./src/routes/subCategoryRoutes.js";
import quizAttemptRoutes from "./src/routes/quizAttemptRoutes.js";
import attemptedQuestionRoutes from "./src/routes/attemptedQuestionRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

// Allowed web frontends
const allowedOrigins = [
  "https://www.dialkaraikudi.com",
  "https://dialkaraikudi.com",
  "www.dialkaraikudi.com",
];

if (process.env.NODE_ENV === "production") {
  // Strict CORS for production
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    }),
  );
} else {
  // Open CORS for local/test/dev environments
  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  );
  console.log("⚠️  CORS: Development mode — all origins allowed");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/quizAttempts", quizAttemptRoutes);
app.use("/api/attemptedQuestions", attemptedQuestionRoutes);
app.use("/api/users", userRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
