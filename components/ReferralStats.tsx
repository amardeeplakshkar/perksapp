import React from 'react';
import { Card } from './ui/card';

interface ReferralStatsProps {
  totalReferrals: number;
  totalEarned: number;
}

const ReferralStats: React.FC<ReferralStatsProps> = ({ totalReferrals, totalEarned }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      <Card className="p-4 text-center">
        <p className="text-sm text-muted-foreground">Total Referrals</p>
        <p className="text-2xl font-bold">{totalReferrals}</p>
      </Card>
      <Card className="p-4 text-center">
        <p className="text-sm text-muted-foreground">Points Earned</p>
        <p className="text-2xl font-bold">{totalEarned}</p>
      </Card>
    </div>
  );
};

export default ReferralStats;