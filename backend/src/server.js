const path = require("path");
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
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    scrapeTopStories()
      .then(() => {
        console.log("Initial scrape completed");
      })
      .catch((error) => {
        console.error("Initial scrape failed", error.message);
      });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();


