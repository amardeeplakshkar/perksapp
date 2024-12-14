/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { TonConnectButton } from '@tonconnect/ui-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Users2, ChevronRight, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaAward } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize Next.js router
  const [initData, setInitData] = useState('');
  const [userId, setUserId] = useState('');
  const [startParam, setStartParam] = useState('');

  // Initialize WebApp and referral system
  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        const initData = WebApp.initData;
        const userId = WebApp.initDataUnsafe.user?.id.toString() || '';
        const startParam = WebApp.initDataUnsafe.start_param || '';
  
        console.log("initWebApp initialized with:", { initData, userId, startParam });
  
        // Set the state
        setInitData(initData);
        setUserId(userId);
        setStartParam(startParam);
  
        // Call checkReferral with the current values
        if (startParam && userId) {
          checkReferral(userId, startParam);
        }
      }
    };
  
    initWebApp();
  }, []); // Ensure this runs only once
  
  const checkReferral = async (currentUserId, currentStartParam) => {
    console.log("checkReferral function called with:", { currentUserId, currentStartParam });
    if (currentStartParam && currentUserId) {
      try {
        const referralResponse = await fetch('/api/referrals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: currentUserId, referrerId: currentStartParam }),
        });
  
        if (!referralResponse.ok) throw new Error('Failed to save referral');
        console.log("Referral saved successfully");
      } catch (error) {
        console.error('Error during referral:', error);
      }
    } else {
      console.log("Referral not triggered. Missing parameters:", { currentUserId, currentStartParam });
    }
  };
  

  useEffect(() => {
    const fetchUserData = async () => {
      if (typeof window !== "undefined" && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();

        const initDataUnsafe = tg.initDataUnsafe || { user };

        if (initDataUnsafe.user) {
          try {
            const response = await fetch("/api/user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(initDataUnsafe.user),
            });

            const data = await response.json();

            if (response.ok) {
              setUser(data || {});
              if (!data.hasClaimedWelcomePoints) {
                router.push("/welcome");
              }
            } else {
              throw new Error(data.error || "Failed to fetch user data");
            }
          } catch (err) {
            const errorMsg = "Failed to fetch user data: " + err.message;
            setError(errorMsg);
            toast.error(errorMsg); // Show toast for fetch error
            if (err.message === "Internal server error") {
              tg.close(); // Close the mini app on internal server error
            }
          } finally {
            setLoading(false);
            checkReferral(userId, startParam); // Check referral after fetching user data
          }
        } else {
          const noUserError = "No user data available";
          setError(noUserError);
          toast.error(noUserError); // Show toast for no user data
          setUser({});
          setLoading(false);
        }
      } else {
        const appError = "This app should be opened in Telegram";
        setError(appError);
        toast.error(appError);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return;
  }

  // if (error)
  // {
  //   return <div className="p-4 mx-auto text-red-500">{error}</div>;
  // }
  return (
    <>
      <div className='flex flex-col items-center h-[82vh] space-y-4'>
        <div className="flex flex-1 flex-col justify-center gap-2 items-center">
          <TonConnectButton />
          <div className='flex flex-col items-center mt-8'>
            <FaAward size={'8rem'} />
            <div className="text-center flex items-center gap-2 pt-2">
              <div className="text-4xl font-semibold">
                {user?.points !== undefined && user?.points !== null
                  ? user.points.toLocaleString()
                  : "0"}
              </div>
              <div className="text-base uppercase">perks</div>
            </div>
          </div>
         <div className='group bg-white/5 cursor-pointer p-2 px-4 rounded-full '>
         <p className='flex justify-center items-center text-sm group-hover:shine-effect font-semibold'>
            Perks Level <ChevronRight size={"1rem"}/>
          </p>
         </div>
        </div>
        <div className=" btns-con w-full">
          <Card className="btn-item comunity shine-effect bg-background">
            <Button onClick={() => window.location.href = 'https://t.me/perkscommunity'} variant="nav" className="w-full justify-between p-4 text-base">
              <span className="flex items-center gap-3">
                <Users2 />
                Join our community
              </span>
              <ChevronRight />
            </Button>
          </Card>
          <Card className="btn-item comunity bg-black">
            <Button onClick={() => router.push("/tasks")} variant={'nav'} className="w-full justify-between p-4 text-base">
              <span className="flex items-center gap-3">
                <Star />
                Check your rewards
              </span>
              <ChevronRight />
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
