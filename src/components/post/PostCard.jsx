import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toggleLike, toggleBookmark } from '../../services/postService';
import { useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/helpers';

export default function PostCard({ post }) {
  const { currentUser, userData } = useAuth();
  const { showSuccess, showError } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?.uid));
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(
    userData?.bookmarks?.includes(post.id)
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const newLikedState = await toggleLike(post.id, currentUser.uid);
      setIsLiked(newLikedState);
      setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    } catch (error) {
      showError('Failed to update like');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const newBookmarkedState = await toggleBookmark(currentUser.uid, post.id);
      setIsBookmarked(newBookmarkedState);
      showSuccess(newBookmarkedState ? 'Post bookmarked' : 'Bookmark removed');
    } catch (error) {
      showError('Failed to update bookmark');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Link
      to={`/post/${post.id}`}
      className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 p-6"
    >
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          src={post.authorPhotoURL}
          alt={post.authorName}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">
            {post.authorName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(post.createdAt)}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {post.title}
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {post.content}
      </p>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-3 py-1 text-gray-500 dark:text-gray-400 text-sm">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 hover:text-red-500 transition-colors ${
            isLiked ? 'text-red-500' : ''
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{likeCount}</span>
        </button>

        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{post.commentCount || 0}</span>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>{post.views || 0}</span>
        </div>

        <button
          onClick={handleBookmark}
          className={`ml-auto hover:text-blue-500 transition-colors ${
            isBookmarked ? 'text-blue-500' : ''
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={isBookmarked ? 'currentColor' : 'none'}
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
        </button>
      </div>
    </Link>
  );
}