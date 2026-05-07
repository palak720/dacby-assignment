/*const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = require("./app");
const connectDB = require("./config/db");
const { scrapeTopStories } = require("./services/scraperService");

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await scrapeTopStories();
    console.log("Initial scrape completed");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();*/



const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Backend working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

