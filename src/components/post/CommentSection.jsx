import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { addComment, subscribeToComments } from '../../services/postService';
import { NotificationContext } from '../../context/NotificationContext';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatDate } from '../../utils/helpers';
import { validateComment } from '../../utils/validators';

export default function CommentSection({ postId }) {
  const { currentUser, userData } = useAuth();
  const { showSuccess, showError } = useContext(NotificationContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToComments(postId, (commentsData) => {
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateComment(newComment)) {
      setError('Comment must be between 1 and 500 characters');
      return;
    }

    if (!currentUser) {
      showError('Please login to comment');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addComment(postId, {
        content: newComment,
        authorId: currentUser.uid,
        authorName: userData.displayName,
        authorPhotoURL: userData.photoURL
      });

      setNewComment('');
      showSuccess('Comment added successfully');
    } catch (error) {
      showError('Failed to add comment');
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <Avatar
              src={userData?.photoURL}
              alt={userData?.displayName}
              size="sm"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
                maxLength="500"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {newComment.length}/500
                </span>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newComment.trim() || isSubmitting}
                  loading={isSubmitting}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Please login to comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar
                src={comment.authorPhotoURL}
                alt={comment.authorName}
                size="sm"
              />
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {comment.authorName}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}