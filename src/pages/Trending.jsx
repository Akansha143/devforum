import { useState, useEffect } from 'react';
import { getTrendingPosts } from '../services/postService';
import PostCard from '../components/post/PostCard';
import { PostCardSkeleton } from '../components/common/Skeleton';

export default function Trending() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const trendingPosts = await getTrendingPosts();
        setPosts(trendingPosts);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Trending Posts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Most popular posts from the last 7 days
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
          posts.map((post, index) => (
            <div key={post.id} className="relative">
              <div className="absolute -left-12 top-8 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                {index + 1}
              </div>
              <PostCard post={post} />
            </div>
          ))
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
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Trending Posts
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for trending content
            </p>
          </div>
        )}
      </div>
    </div>
  );
}