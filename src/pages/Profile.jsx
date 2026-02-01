import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile } from '../services/userService';
import { subscribeToPosts } from '../services/postService';
import ProfileHeader from '../components/profile/ProfileHeader';
import PostCard from '../components/post/PostCard';
import Button from '../components/common/Button';
import Skeleton, { PostCardSkeleton } from '../components/common/Skeleton';

export default function Profile() {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  const isOwner = currentUser?.uid === userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile(userId);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const unsubscribe = subscribeToPosts(
      (postsData) => {
        setPosts(postsData);
        setPostsLoading(false);
      },
      { authorId: userId }
    );

    return () => unsubscribe();
  }, [userId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Skeleton type="card" className="mb-6 h-64" />
        <PostCardSkeleton />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            User Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This user doesn't exist.
          </p>
          <Button onClick={() => navigate('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ProfileHeader user={user} isOwner={isOwner} />

      {/* Posts Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Posts ({posts.length})
        </h2>

        <div className="space-y-4">
          {postsLoading ? (
            <>
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Posts Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isOwner
                  ? "You haven't created any posts yet."
                  : "This user hasn't created any posts yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}