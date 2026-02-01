import { useState } from 'react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import ProfileEditor from './ProfileEditor';

export default function ProfileHeader({ user, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <Avatar
            src={user.photoURL}
            alt={user.displayName}
            size="xl"
            online={user.online}
          />

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {user.displayName}
            </h1>
            {user.bio && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {user.bio}
              </p>
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 justify-center md:justify-start">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">{user.reputation || 0} reputation</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  Joined {user.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {isOwner && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Editor Modal */}
      {isEditing && (
        <ProfileEditor
          user={user}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}