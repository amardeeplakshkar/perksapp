"use client"

import React from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Referral {
  username: string;
  firstName: string;
  lastName: string;
  joinedAt?: Date;
}

interface ReferralListProps {
  referrals: Referral[];
}

const ReferralList: React.FC<ReferralListProps> = ({ referrals }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Referred Users</h3>
      <ScrollArea className="h-[40dvh]">
        {referrals.length === 0 ? (
          <p className="text-center text-muted-foreground">No referrals yet</p>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-foreground/5 rounded-lg"
              >
                <div className='flex justify-center items-center gap-4'>
                  <Avatar >
                    <AvatarFallback className='bg-red-500/70'>
                      {referral.username?.[0] || `${referral.firstName?.[0] || ''}${referral.lastName?.[0] || ''}`.trim()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {referral.username || `${referral.firstName} ${referral.lastName}`.trim()}
                    </p>
                    {referral.joinedAt && (
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(referral.joinedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <>
                  500
                </>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

export default ReferralList;