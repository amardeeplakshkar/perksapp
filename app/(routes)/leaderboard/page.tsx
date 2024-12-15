
import { Card } from '../../../components/ui/card';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { LiveEmoji } from 'liveemoji'
import React, { useEffect, useState } from 'react'
import { FaAward, FaCrown } from 'react-icons/fa';
import { Skeleton } from 'components/ui/skeleton';
import { Separator } from 'components/ui/separator';
import UserCard from 'components/userCard';
import LogoHeader from 'components/LogoHeader';

type LeaderboardData = {
  username: string;
  balance: number;
  chatId: number;
};

const Leaderboard = async () => {
  // const { userData, loading, error, userId } = useUserData();
  const res = await fetch('https://api.paws.community/v1/user/leaderboard?page=0&limit=100', {
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYxMDI2ODQxMTQsImlhdCI6MTczNDA5NDU2NywiZXhwIjoxNzM0MTgwOTY3fQ.UDqYfCrzdmXrVOYXjhWfhR5gQJa72df0y1mLz4y0K4o',
    },
  });

  const data = await res.json();

  if (!data.success) {
    return <div>Failed to load leaderboard data</div>;
  }

  const leaderboardData: LeaderboardData[] = data.data.list;

  const getBackgroundClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[#ffec451a]"; // Gold
      case 2:
        return "bg-[#c7c7c71a]"; // Silver
      case 3:
        return "bg-[#ffa2451a]"; // Bronze
      default:
        return ""; // Default
    }
  };
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
              {leaderboardData.map((user, index) => {
                const position = leaderboardData.length + index - 99; 
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
                    {index !== leaderboardData.length - 1 && <Separator />}
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
