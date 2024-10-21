import React, { useState } from 'react';
import { User, Meme } from '../types';
import { Edit2, Save, UserPlus, UserMinus } from 'lucide-react';

interface UserProfileProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  allUsers: User[]; // This should be passed from the parent component
  onFollowUser: (userId: number) => void;
  onUnfollowUser: (userId: number) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, setUser, allUsers, onFollowUser, onUnfollowUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(user?.name || '');

  if (!user) return <div>Loading user profile...</div>;

  const handleUsernameChange = () => {
    if (isEditing) {
      setUser({ ...user, name: editedUsername });
    }
    setIsEditing(!isEditing);
  };

  const renderStats = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Your Stats</h3>
      <ul className="space-y-2">
        <li>Total Submissions: {user.totalSubmissions}</li>
        <li>Streak: {user.streak} days</li>
        <li>Liked Memes: {user.likedMemes.length}</li>
        <li>Shiller's Picks: {user.shillersPicks.length}</li>
        <li>Followers: {user.followers.length}</li>
        <li>Following: {user.following.length}</li>
      </ul>
    </div>
  );

  const renderSubmissions = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-xl font-bold mb-4">Your Submissions</h3>
      {user.submittedMemes.length > 0 ? (
        <ul className="space-y-2">
          {user.submittedMemes.map((meme, index) => (
            <li key={index}>{meme}</li>
          ))}
        </ul>
      ) : (
        <p>You haven't submitted any memes yet.</p>
      )}
    </div>
  );

  const renderFollowers = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-xl font-bold mb-4">Followers</h3>
      {user.followers.length > 0 ? (
        <ul className="space-y-2">
          {user.followers.map((followerId) => {
            const follower = allUsers.find(u => u.id === followerId);
            return (
              <li key={followerId} className="flex justify-between items-center">
                <span>{follower?.name || 'Unknown User'}</span>
                <button
                  onClick={() => onFollowUser(followerId)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded flex items-center"
                >
                  <UserPlus size={16} className="mr-1" /> Follow Back
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>You don't have any followers yet.</p>
      )}
    </div>
  );

  const renderFollowing = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
      <h3 className="text-xl font-bold mb-4">Following</h3>
      {user.following.length > 0 ? (
        <ul className="space-y-2">
          {user.following.map((followingId) => {
            const following = allUsers.find(u => u.id === followingId);
            return (
              <li key={followingId} className="flex justify-between items-center">
                <span>{following?.name || 'Unknown User'}</span>
                <button
                  onClick={() => onUnfollowUser(followingId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded flex items-center"
                >
                  <UserMinus size={16} className="mr-1" /> Unfollow
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>You're not following anyone yet.</p>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          {isEditing ? (
            <input
              type="text"
              value={editedUsername}
              onChange={(e) => setEditedUsername(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded"
            />
          ) : (
            user.name
          )}
        </h2>
        <button
          onClick={handleUsernameChange}
          className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded"
        >
          {isEditing ? (
            <>
              <Save className="mr-2" size={18} />
              Save
            </>
          ) : (
            <>
              <Edit2 className="mr-2" size={18} />
              Edit Username
            </>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {renderStats()}
          {renderSubmissions()}
        </div>
        <div>
          {renderFollowers()}
          {renderFollowing()}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;