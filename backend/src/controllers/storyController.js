const mongoose = require("mongoose");

const Story = require("../models/Story");
const User = require("../models/User");
const { scrapeTopStories } = require("../services/scraperService");

const serializeStory = (story, bookmarkSet) => ({
  id: story._id,
  title: story.title,
  url: story.url,
  points: story.points,
  author: story.author,
  postedAt: story.postedAt,
  hnId: story.hnId,
  isBookmarked: bookmarkSet ? bookmarkSet.has(String(story._id)) : false,
});

const getBookmarkSet = async (userId) => {
  if (!userId) {
    return null;
  }

  const user = await User.findById(userId).select("bookmarks");
  return new Set((user?.bookmarks || []).map((bookmarkId) => String(bookmarkId)));
};

const getStories = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.max(Number(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const bookmarkSet = await getBookmarkSet(req.user?._id);
    const query = {};

    if (req.query.bookmarked === "true") {
      if (!bookmarkSet) {
        return res.status(401).json({ message: "Authentication required" });
      }
      query._id = { $in: Array.from(bookmarkSet) };
    }

    const [stories, total] = await Promise.all([
      Story.find(query).sort({ points: -1, postedAt: -1 }).skip(skip).limit(limit),
      Story.countDocuments(query),
    ]);

    res.json({
      stories: stories.map((story) => serializeStory(story, bookmarkSet)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getStoryById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid story id" });
    }

    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const bookmarkSet = await getBookmarkSet(req.user?._id);
    res.json({ story: serializeStory(story, bookmarkSet) });
  } catch (error) {
    next(error);
  }
};

const toggleBookmark = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid story id" });
    }

    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const user = await User.findById(req.user._id);
    const alreadyBookmarked = user.bookmarks.some(
      (bookmarkId) => String(bookmarkId) === String(story._id)
    );

    if (alreadyBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (bookmarkId) => String(bookmarkId) !== String(story._id)
      );
    } else {
      user.bookmarks.push(story._id);
    }

    await user.save();

    res.json({
      message: alreadyBookmarked ? "Bookmark removed" : "Bookmark added",
      isBookmarked: !alreadyBookmarked,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

const triggerScrape = async (_req, res, next) => {
  try {
    const stories = await scrapeTopStories();
    res.status(201).json({
      message: "Scrape completed successfully",
      count: stories.length,
      stories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStories,
  getStoryById,
  toggleBookmark,
  triggerScrape,
};
