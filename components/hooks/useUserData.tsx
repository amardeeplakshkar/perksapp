"use client"
import { useState, useEffect } from 'react';

type Referral = {
  telegramId: number;
  username: string;
  firstName: string;
  lastName: string;
  joinedAt: string;
};

type UserData = {
  telegramId: number;
  username: string;
  firstName: string;
  lastName: string;
  points: number;
  hasClaimedWelcomePoints: boolean;
  dailyPlays: number;
  referredByTelegramId: number | null;
  referrals: Referral[];
  completedTaskIds: number[];
  photo_url: string;
  perkLevel : string;
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [photoUrl, setphotoUrl] = useState<string>('');


  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        const id = WebApp.initDataUnsafe.user?.id.toString() || '';
        const photo_url = WebApp.initDataUnsafe.user?.photo_url.toString() || '';
        setUserId(id);
        setphotoUrl(photo_url)
        if (id) {
          fetchUserData(id);
        }
      }
    };

    initWebApp();
  }, []);

  const fetchUserData = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/user?telegramId=${id}`);

      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setUserData(data);
    } catch (error: any) {
      setError(error.message || 'An error occurred while fetching user data');
    } finally {
      setLoading(false);
    }
  };

  return { userData, loading, error, userId, photoUrl };
};
