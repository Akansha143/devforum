import { useState, useEffect } from 'react';
import { subscribeToPosts } from '../services/postService';
import PostCard from '../components/post/PostCard';
import { PostCardSkeleton } from '../components/common/Skeleton';
import { POST_TAGS } from '../utils/constants';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPosts(
      (postsData) => {
        setPosts(postsData);
        setLoading(false);
      },
      { tag: selectedTag, limit: 50 }
    );

    return () => unsubscribe();
  }, [selectedTag]);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'newest') {
      return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    } else if (sortBy === 'popular') {
      return (b.likeCount || 0) - (a.likeCount || 0);
    } else if (sortBy === 'discussed') {
      return (b.commentCount || 0) - (a.commentCount || 0);
    }
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Developer Forum
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share knowledge, ask questions, and connect with developers
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
        {/* Sort Options */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort by:
          </span>
          {['newest', 'popular', 'discussed'].map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                sortBy === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>

        {/* Tag Filter */}
        <div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Filter by tag:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag('')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTag === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {POST_TAGS.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {loading ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        ) : sortedPosts.length > 0 ? (
          sortedPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedTag
                ? `No posts with tag "${selectedTag}" yet.`
                : 'Be the first to create a post!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}