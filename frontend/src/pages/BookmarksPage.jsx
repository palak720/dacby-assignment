import StoryListPage from "./StoryListPage";

function BookmarksPage() {
  return (
    <StoryListPage
      title="Your bookmarks"
      description="A focused view of the stories you saved."
      bookmarkedOnly
    />
  );
}

export default BookmarksPage;

