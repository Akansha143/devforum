import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subscribeToPost } from '../services/postService';
import PostDetail from '../components/post/PostDetail';
import CommentSection from '../components/post/CommentSection';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToPost(id, (postData) => {
      if (postData) {
        setPost(postData);
        setLoading(false);
      } else {
        setError('Post not found');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Skeleton type="card" className="mb-6" />
        <Skeleton type="card" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Post Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Button>

      <div className="space-y-6">
        <PostDetail post={post} />
        <CommentSection postId={id} />
      </div>
    </div>
  );
}