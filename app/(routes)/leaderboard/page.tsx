"use client"

import { Card } from '../../../components/ui/card';
import { ScrollArea } from '../../../components/ui/scroll-area';
import React, { useEffect, useState } from 'react'
import { FaAward, FaCrown } from 'react-icons/fa';
import { Separator } from 'components/ui/separator';
import UserCard from 'components/userCard';
import LogoHeader from 'components/LogoHeader';
import Loader from 'components/Loader';

const Leaderboard = async () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loadingTopUsers, setLoadingTopUsers] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        if (!response.ok) throw new Error("Failed to fetch top users");

        const data = await response.json();
        setTopUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingTopUsers(false);
      }
    };

    fetchTopUsers();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initDataUnsafe = tg.initDataUnsafe || {user};
      if (initDataUnsafe.user) {
        fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error);
            } else {
              setUser(data);
            }
          })
          .catch((err) => setError("Failed to fetch user data: " + err.message));
      } else {
        setError("No user data available");
      }
    } else {
      setError("This app should be opened in Telegram");
    }
  }, []);

  const getBackgroundClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[#ffec451a]"; // Gold
      case 2:
        return "bg-[#c7c7c71a]"; // Silver
      case 3:
        return "bg-[#ffa2451a]"; // Bronze
      default:
        return "";
    }
  };

  if (error) return <div className="mx-auto p-4 text-red-500">{error}</div>;

  if (!user) return <Loader />;
  return (
    <div>
      <div className='flex flex-col w-full'>
        <div className='flex-1 flex flex-col items-center'>
         <LogoHeader header='leaderboard' icon='DuckLeaderboard' about=' boost Perks to top leaderboards'/>
          <div className='w-[90%] shine-effect mt-2 bg-foreground/5 rounded-xl'>
            <div className={`pr-2`}>
              <div className="p-4 py-2  flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`rounded-xl p-3 border-foreground bg-black`}>
                    <FaAward />
                  </div>
                 <UserCard/>
                </div>
                <div className="text-right ">
                  <FaCrown />
                </div>
              </div>
            </div>
          </div>
          <Card className="w-dvw mt-2">
            <ScrollArea className="rounded-xl w-full bg-muted-foreground/10 overflow-x-hidden h-[50dvh]">
              {topUsers.map((user, index) => {
                const position = topUsers.length + index - 9; 
                const isMedal = position <= 3;

                const medalEmoji = isMedal
                  ? position === 1
                    ? '🥇'
                    : position === 2
                      ? '🥈'
                      : '🥉'
                  : null;

                  const backgroundClass = getBackgroundClass(position);

                return (
                  <div key={index} className={` border-gray-500/30 ${backgroundClass}`}>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`rounded-[.3rem] p-2 border-foreground bg-white`}>
                          <FaAward fill="black" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold">{user.username}</h3>
                          <p className="text-muted-foreground text-xs">
                            {user.balance.toLocaleString()} PERKS
                          </p>
                        </div>
                      </div>
                      <div className="text-right pr-2">
                        {medalEmoji || position}
                      </div>
                    </div>
                    {index !== topUsers.length - 1 && <Separator />}
                  </div>
                );
              })}
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
