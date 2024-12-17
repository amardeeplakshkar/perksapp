"use client"
import React from 'react';
import { useUserData } from '../../../components/hooks/useUserData'; 
const UserProfile = () => {
  const { userData, loading, error, userId } = useUserData();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h2>{userData.username}'s Profile</h2>
      <p>User ID: {userId}</p>
      <p>Name: {userData.firstName} {userData.lastName}</p>
      <p>Points: {userData.points}</p>
      <p>Referred By: {userData.referredByTelegramId || 'N/A'}</p>

      <h3>Referrals: {userData.referrals.length} </h3>
      <ul>
        {userData.referrals.map((referral) => (
          <li key={referral.telegramId}>
            {referral.username} (Joined at: {new Date(referral.joinedAt).toLocaleDateString()})
          </li>
        ))}
      </ul>

      <h3>Completed Tasks:</h3>
      <ul>
        {userData.completedTaskIds.map((taskId) => (
          <li key={taskId}>Task ID: {taskId}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
