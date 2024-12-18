"use client"

import { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/card';
import { ScrollArea } from '../../../components/ui/scroll-area';
import React from 'react';
import { FaAward, FaCrown } from 'react-icons/fa';
import { Separator } from 'components/ui/separator';
import UserCard from 'components/userCard';
import LogoHeader from 'components/LogoHeader';
import Loader from 'components/Loader';
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar';
import { useUserData } from 'components/hooks/useUserData';

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [loadingTopUsers, setLoadingTopUsers] = useState(true);
  const [error, setError] = useState(null);
  const { photoUrl } = useUserData();

  
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

  useEffect(() => {
    fetchTopUsers(); 

    const intervalId = setInterval(() => {
      fetchTopUsers();
    }, 600000); 

    
    return () => clearInterval(intervalId);
  }, []);

  const getBackgroundClass = (medalEmoji) => {
    switch (medalEmoji) {
      case "🥇":
        return "bg-gold-500/15";
      case "🥈":
        return "bg-silver-500/15";
      case "🥉":
        return "bg-bronze-500/15";
      default:
        return ""; 
    }
  };

  if (loadingTopUsers) return <Loader />;
  if (error) return <div className="mx-auto p-4 text-red-500">{error}</div>;

  return (
    <div>
      <div className="flex flex-col w-full">
        <div className="flex-1 flex flex-col items-center">
          <LogoHeader header="leaderboard" icon="DuckLeaderboard" about="boost Perks to top leaderboards" />
          <div className="w-[90%] shine-effect mt-2 bg-foreground/5 rounded-xl">
            <div className="p-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className='rounded-xl'>
                  <AvatarImage src={photoUrl} />
                  <AvatarFallback className='rounded-xl p-3 border-foreground bg-black'>
                    <FaAward />
                  </AvatarFallback>
                </Avatar>
                <UserCard />
              </div>
              <div className="text-right ">
                <FaCrown />
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

                const backgroundClass = getBackgroundClass(medalEmoji);

                return (
                  <div key={index} className="border-gray-500/30">
                    <div className={`p-4 flex items-center justify-between ${backgroundClass}`}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Avatar className='rounded-xl'>
                            <AvatarImage src={user?.photo_url} />
                            <AvatarFallback className='border-foreground bg-white rounded-xl'>
                              <FaAward fill='black' />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold">{user.firstName || user.username}</h3>
                          <p className="text-muted-foreground text-xs">
                            {user.points.toLocaleString()} PERKS
                          </p>
                        </div>
                      </div>
                      <div className="text-right pr-2">{medalEmoji || position}</div>
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
