import { useEffect, useState } from "react";

import client from "../api/client";
import StoryCard from "../components/StoryCard";
import { useAuth } from "../context/AuthContext";

function StoryListPage({ title, description, bookmarkedOnly = false }) {
  const { isAuthenticated, refreshUser } = useAuth();
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState("");

  const fetchStories = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await client.get("/stories", {
        params: {
          page,
          limit: 10,
          bookmarked: bookmarkedOnly ? "true" : undefined,
        },
      });

      setStories(response.data.stories);
      setPagination(response.data.pagination);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories(1);
  }, [bookmarkedOnly, isAuthenticated]);

  const handleBookmarkToggle = async (storyId) => {
    setBookmarkLoadingId(storyId);

    try {
      await client.post(`/stories/${storyId}/bookmark`);
      await refreshUser();
      await fetchStories(pagination.page);
    } catch (toggleError) {
      setError(toggleError.response?.data?.message || "Failed to update bookmark");
    } finally {
      setBookmarkLoadingId("");
    }
  };

  return (
    <section>
      <div className="page-hero">
        <p className="eyebrow">{bookmarkedOnly ? "Saved Stories" : "Live Feed"}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      {error ? <div className="notice error-notice">{error}</div> : null}

      {loading ? (
        <div className="empty-state">Loading stories...</div>
      ) : stories.length ? (
        <>
          <div className="story-grid">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                onBookmarkToggle={handleBookmarkToggle}
                loadingBookmark={bookmarkLoadingId === story.id}
              />
            ))}
          </div>

          <div className="pagination-bar">
            <button
              type="button"
              className="ghost-button"
              disabled={pagination.page === 1}
              onClick={() => fetchStories(pagination.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              className="ghost-button"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => fetchStories(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          {bookmarkedOnly ? "No bookmarks yet." : "No stories available right now."}
        </div>
      )}
    </section>
  );
}

export default StoryListPage;

