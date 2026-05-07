import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function StoryCard({ story, onBookmarkToggle, loadingBookmark }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleBookmark = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    onBookmarkToggle(story.id);
  };

  return (
    <article className="story-card">
      <div className="story-meta">
        <span>{story.points} points</span>
        <span>{story.author}</span>
        <span>{new Date(story.postedAt).toLocaleString()}</span>
      </div>

      <h3>{story.title}</h3>

      <div className="story-actions">
        <a href={story.url} target="_blank" rel="noreferrer">
          Visit story
        </a>
        <button type="button" onClick={handleBookmark} disabled={loadingBookmark}>
          {story.isBookmarked ? "Remove bookmark" : "Bookmark"}
        </button>
      </div>
    </article>
  );
}

export default StoryCard;

