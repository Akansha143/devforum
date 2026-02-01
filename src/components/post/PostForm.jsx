import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { createPost } from '../../services/postService';
import { NotificationContext } from '../../context/NotificationContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import Input from '../common/Input';
import Button from '../common/Button';
import { POST_TAGS } from '../../utils/constants';
import { validatePostTitle, validatePostContent } from '../../utils/validators';

export default function PostForm() {
  const { currentUser, userData } = useAuth();
  const { showSuccess, showError } = useContext(NotificationContext);
  const navigate = useNavigate();
  
  const [draft, setDraft, removeDraft] = useLocalStorage('post-draft', {
    title: '',
    content: '',
    tags: []
  });

  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);
  const [selectedTags, setSelectedTags] = useState(draft.tags);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Auto-save draft
  const saveDraft = () => {
    setDraft({ title, content, tags: selectedTags });
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const validate = () => {
    const newErrors = {};

    if (!validatePostTitle(title)) {
      newErrors.title = 'Title must be between 5 and 200 characters';
    }

    if (!validatePostContent(content)) {
      newErrors.content = 'Content must be at least 10 characters';
    }

    if (selectedTags.length === 0) {
      newErrors.tags = 'Please select at least one tag';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      showError('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const post = await createPost({
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags,
        authorId: currentUser.uid,
        authorName: userData.displayName,
        authorPhotoURL: userData.photoURL
      });

      removeDraft();
      showSuccess('Post created successfully!');
      navigate(`/post/${post.id}`);
    } catch (error) {
      showError('Failed to create post');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Input
        label="Post Title"
        type="text"
        placeholder="Enter an engaging title..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          saveDraft();
        }}
        error={errors.title}
        required
      />

      {/* Content */}
      <Input
        label="Content"
        type="textarea"
        placeholder="Share your knowledge, ask questions, or start a discussion..."
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          saveDraft();
        }}
        rows={12}
        error={errors.content}
        required
      />

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {POST_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                handleTagToggle(tag);
                saveDraft();
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
        {errors.tags && (
          <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
        )}
        {selectedTags.length > 0 && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Selected: {selectedTags.join(', ')}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            saveDraft();
            showSuccess('Draft saved!');
          }}
        >
          Save Draft
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Publish Post
          </Button>
        </div>
      </div>
    </form>
  );
}