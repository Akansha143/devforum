import PostForm from '../components/post/PostForm';

export default function CreatePost() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create a New Post
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Share your knowledge, ask questions, or start a discussion
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <PostForm />
      </div>
    </div>
  );
}