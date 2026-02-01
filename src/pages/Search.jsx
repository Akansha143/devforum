import { useState, useCallback } from 'react';
import { searchPosts } from '../services/postService';
import PostCard from '../components/post/PostCard';
import Input from '../components/common/Input';
import { PostCardSkeleton } from '../components/common/Skeleton';
import { debounce } from '../utils/helpers';

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        setPosts([]);
        setHasSearched(false);
        return;
      }

      setLoading(true);
      setHasSearched(true);

      try {
        const results = await searchPosts(term);
        setPosts(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Search Posts
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Search by title, content, or tags
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="text-lg"
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        ) : hasSearched ? (
          posts.length > 0 ? (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Found {posts.length} {posts.length === 1 ? 'result' : 'results'}
              </p>
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </>
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Results Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try searching with different keywords
              </p>
            </div>
          )
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Start Searching
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter keywords to search for posts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}