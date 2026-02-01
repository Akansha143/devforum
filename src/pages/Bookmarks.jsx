import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getBookmarkedPosts } from '../services/postService';
import PostCard from '../components/post/PostCard';
import { PostCardSkeleton } from '../components/common/Skeleton';

export default function Bookmarks() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const bookmarkedPosts = await getBookmarkedPosts(currentUser.uid);
        setPosts(bookmarkedPosts);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [currentUser]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Bookmarked Posts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Posts you've saved for later
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        ) : posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Bookmarks Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start bookmarking posts to save them for later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}