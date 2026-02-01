import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toggleLike, toggleBookmark } from '../../services/postService';
import { useContext } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/helpers';

export default function PostDetail({ post }) {
  const { currentUser, userData } = useAuth();
  const { showSuccess, showError } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser?.uid));
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(
    userData?.bookmarks?.includes(post.id)
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLike = async () => {
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

  const handleBookmark = async () => {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-6">
        <Avatar
          src={post.authorPhotoURL}
          alt={post.authorName}
          size="md"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-900 dark:text-white">
            {post.authorName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(post.createdAt)} · {post.views || 0} views
          </p>
        </div>
      </div>

      {/* Post Title */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {post.title}
      </h1>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Content */}
      <div className="prose dark:prose-invert max-w-none mb-8">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLike}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isLiked
              ? 'bg-red-50 dark:bg-red-900/20 text-red-500'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
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
          <span className="font-medium">{likeCount} Likes</span>
        </button>

        <button
          onClick={handleBookmark}
          disabled={isProcessing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isBookmarked
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500'
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
          <span className="font-medium">
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </span>
        </button>

        <div className="ml-auto text-gray-500 dark:text-gray-400">
          {post.commentCount || 0} comments
        </div>
      </div>
    </div>
  );
}