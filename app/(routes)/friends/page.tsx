'use client';

import React, { useEffect, useState } from 'react';
import Heading from '../../../components/Heading';
import ReferralLink from '../../../components/ReferralLink';
import ReferralStats from '../../../components/ReferralStats';
import ReferralList from '../../../components/ReferralList';
import { toast } from 'react-hot-toast';
import LogoHeader from 'components/LogoHeader';

const FriendsPage = () => {
  const [userId, setUserId] = useState<string>('');
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({ totalReferrals: 0, totalEarned: 0 });

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        const userId = WebApp.initDataUnsafe.user?.id.toString() || '';
        setUserId(userId);

        if (userId) {
          fetchReferralData(userId);
        }
      }
    };

    initWebApp();
  }, []);

  const fetchReferralData = async (userId: string) => {
    try {
      const response = await fetch(`/api/referrals?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setReferrals(data.referrals || []);
        setStats({
          totalReferrals: data.referrals?.length || 0,
          totalEarned: data.referrals?.length * 500 || 0, // 500 points per referral
        });
      } else {
        toast.error('Failed to fetch referral data');
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast.error('Error loading referral data');
    }
  };

  return (

    <div className="flex flex-col h-[88dvh]">
      <div className="p-4 flex-1">
        <LogoHeader header='Friends' icon='Handshake' about='refer friends and earn more perks '/>
        {userId && <ReferralLink telegramId={userId} />}
        <ReferralStats
          totalReferrals={stats.totalReferrals}
          totalEarned={stats.totalEarned}
        />
        <ReferralList referrals={referrals} />
      </div>
    </div>

  );
};

export default FriendsPage;