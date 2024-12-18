'use client';

import React, { useEffect, useState } from 'react';
import ReferralLink from '../../../components/ReferralLink';
import ReferralStats from '../../../components/ReferralStats';
import ReferralList from '../../../components/ReferralList';
import { toast } from 'react-hot-toast';
import LogoHeader from 'components/LogoHeader';
import Loader from 'components/Loader';

const FriendsPage = () => {
  const [userId, setUserId] = useState<string>('');
  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({ totalReferrals: 0, totalEarned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initWebApp = async () => {
      try {
        if (typeof window !== 'undefined') {
          const WebApp = (await import('@twa-dev/sdk')).default;
          WebApp.ready();
          const userId = WebApp.initDataUnsafe.user?.id.toString() || '';
          setUserId(userId);

          if (userId) {
            fetchReferralData(userId);
          } else {
            toast.error('User ID is not available.');
          }
        }
      } catch (error) {
        console.error('Error initializing WebApp:', error);
        toast.error('Failed to initialize WebApp.');
      } finally {
        setLoading(false);
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

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="flex flex-col h-[88dvh]">
      <div className="pt-4 flex-1">
        <LogoHeader header='Friends' icon='DuckRefer' about='refer friends and earn more perks '/>
        {userId ? (
          <>
            <ReferralLink telegramId={userId} />
            <ReferralStats
              totalReferrals={stats.totalReferrals}
              totalEarned={stats.totalEarned}
            />
            <ReferralList referrals={referrals} />
          </>
        ) : (
          <div className='text-center text-red-500'>No user ID available</div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
