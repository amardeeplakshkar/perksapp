"use client";
import { useState, useEffect } from "react";

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
  perkLevel: string;
};

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");

  useEffect(() => {
    const initWebApp = async () => {
      try {
        if (typeof window !== "undefined") {
          const WebApp = (await import("@twa-dev/sdk")).default;
          WebApp.ready();

          const user = WebApp.initDataUnsafe.user;
          if (user) {
            const id = user?.id?.toString() || "";
            const photo_url = user?.photo_url || "/default-avatar.png";

            setUserId(id);
            setPhotoUrl(photo_url);

            if (id) {
              await fetchUserData(id, photo_url); // Fetch user data and push to DB
            }
          } else {
            console.error("No user data available in initDataUnsafe.");
          }
        }
      } catch (err) {
        console.error("Error initializing WebApp:", err);
      }
    };

    initWebApp();
  }, []);

  const fetchUserData = async (id: string, photo_url: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/user?telegramId=${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setUserData(data);

      // Push `photoUrl` to the database after successfully fetching user data
      await pushPhotoUrlToDB(id, photo_url);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const pushPhotoUrlToDB = async (telegramId: string, photoUrl: string) => {
    try {
      const res = await fetch(`/api/user/photoUrl`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ telegramId, photoUrl }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to push photoUrl to the database");
      }
  
      console.log("Photo URL successfully pushed to the database!");
    } catch (err) {
      console.error("Error pushing photoUrl to the database:", err);
    }
  };
  

  return { userData, loading, error, userId, photoUrl };
};