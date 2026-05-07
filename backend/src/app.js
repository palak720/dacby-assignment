const cors = require("cors");
const express = require("express");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const storyRoutes = require("./routes/storyRoutes");
const { triggerScrape } = require("./controllers/storyController");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.post("/api/scrape", triggerScrape);
app.use("/api/stories", storyRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
