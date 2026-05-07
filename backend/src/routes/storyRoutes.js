const express = require("express");

const {
  getStories,
  getStoryById,
  toggleBookmark,
  triggerScrape,
} = require("../controllers/storyController");
const { optionalAuth, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", optionalAuth, getStories);
router.get("/:id", optionalAuth, getStoryById);
router.post("/scrape", triggerScrape);
router.post("/:id/bookmark", protect, toggleBookmark);

module.exports = router;

