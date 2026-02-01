import { useState, useContext } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../services/userService';
import { NotificationContext } from '../../context/NotificationContext';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

export default function ProfileEditor({ user, onClose }) {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useContext(NotificationContext);
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    bio: user.bio || '',
    skills: user.skills?.join(', ') || '',
    photoURL: user.photoURL || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateUserProfile(currentUser.uid, {
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim(),
        skills: formData.skills
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0),
        photoURL: formData.photoURL.trim() || user.photoURL
      });

      showSuccess('Profile updated successfully!');
      onClose();
    } catch (error) {
      showError('Failed to update profile');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Edit Profile"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isSubmitting}>
            Save Changes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Display Name"
          name="displayName"
          value={formData.displayName}
          onChange={handleChange}
          placeholder="Your name"
          required
        />

        <Input
          label="Photo URL"
          name="photoURL"
          value={formData.photoURL}
          onChange={handleChange}
          placeholder="https://example.com/photo.jpg"
        />

        <Input
          label="Bio"
          name="bio"
          type="textarea"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          rows={4}
        />

        <Input
          label="Skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="JavaScript, React, Node.js (comma-separated)"
        />
      </form>
    </Modal>
  );
}