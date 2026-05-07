const axios = require("axios");
const cheerio = require("cheerio");

const Story = require("../models/Story");

const parseRelativeTimeToDate = (value) => {
  const now = new Date();
  const match = value.match(/(\d+)\s+(minute|hour|day|month|year)s?\s+ago/i);

  if (!match) {
    return now;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const postedAt = new Date(now);

  if (unit === "minute") {
    postedAt.setMinutes(now.getMinutes() - amount);
  } else if (unit === "hour") {
    postedAt.setHours(now.getHours() - amount);
  } else if (unit === "day") {
    postedAt.setDate(now.getDate() - amount);
  } else if (unit === "month") {
    postedAt.setMonth(now.getMonth() - amount);
  } else if (unit === "year") {
    postedAt.setFullYear(now.getFullYear() - amount);
  }

  return postedAt;
};

const scrapeTopStories = async () => {
  const { data } = await axios.get("https://news.ycombinator.com", {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(data);
  const storyRows = $(".athing").slice(0, 10);
  const storyPayloads = [];

  storyRows.each((_index, element) => {
    const row = $(element);
    const subtextRow = row.next();
    const titleLink = row.find(".titleline a").first();
    const pointsText = subtextRow.find(".score").text();
    const author = subtextRow.find(".hnuser").text();
    const ageText = subtextRow.find(".age").text();

    storyPayloads.push({
      hnId: row.attr("id"),
      title: titleLink.text().trim(),
      url: titleLink.attr("href") || "",
      points: Number(pointsText.replace(/\D/g, "")) || 0,
      author: author || "unknown",
      postedAt: parseRelativeTimeToDate(ageText),
    });
  });

  const savedStories = await Promise.all(
    storyPayloads.map(async (story) => {
      const updatedStory = await Story.findOneAndUpdate(
        { hnId: story.hnId },
        story,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      return updatedStory;
    })
  );

  return savedStories;
};

module.exports = {
  scrapeTopStories,
};

