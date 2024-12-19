"use client"

import { useEffect, useState } from 'react';
import { useUserData } from './hooks/useUserData';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { FaCoins } from 'react-icons/fa6';
import { Avatar } from './ui/avatar';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import confetti from 'canvas-confetti';
import { FaCheck } from 'react-icons/fa';
import { DelayDialogClose, Dialog, DialogClose, DialogContent, DialogTrigger } from './ui/dialog';
import NumberTicker from './ui/number-ticker';
import { useRouter } from 'next/navigation';

export default function CheckInComponent() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [streak, setStreak] = useState(null);
    const [points, setPoints] = useState(null);
    const { userId } = useUserData()
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const router = useRouter()
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
                            const end = Date.now() + 3 * 1000;
                            const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];
                            const frame = () => {
                                if (Date.now() > end) return;
                                confetti({
                                    particleCount: 2,
                                    angle: 60,
                                    spread: 55,
                                    startVelocity: 60,
                                    origin: { x: 0, y: 0.5 },
                                    colors: colors,
                                });
                                confetti({
                                    particleCount: 2,
                                    angle: 120,
                                    spread: 55,
                                    startVelocity: 60,
                                    origin: { x: 1, y: 0.5 },
                                    colors: colors,
                                });
                                requestAnimationFrame(frame);
                            };
                            frame();
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
    }, []);


    const handleCheckIn = async () => {
        setLoading(true);
        router.push("/dashboard")
        try {
            const response = await fetch('/api/checkin', {
                method: 'POST',
                body: JSON.stringify({ telegramId: userId }),
            });
            const data = await response.json();

            if (data.error) {
                toast.error(data.error); // Show error toast
            } else {
                setStatus(data.message);
                setStreak(data.streak);
                setPoints(data.points);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error('An error occurred while checking in');
        } finally {
            setLoading(false);
        }
    };

    const checkInStreak = user?.checkInStreak;

    return (
        <>
            <Dialog defaultOpen>
                <DialogContent className='h-dvh w-dvw flex flex-col p-3'>
                    <div className='h-full w-full  flex flex-col items-center'>
                        <div className='mt-[15dvh] flex flex-col justify-center items-center'>
                            <NumberTicker
                                direction="up"
                                decimalPlaces={0}
                                className="text-6xl font-bold text-white"
                                value={!checkInStreak ? 1 : checkInStreak + 1 || 0}
                            />
                            <p className='font-semibold'>Days Check-In</p>
                        </div>
                        <p className='text-center mt-auto capitalize text-xs text-muted-foreground'>
                            check-ins are your best friend here, keep them going for bonuses that are straight!
                        </p>
                    </div>
                    <DialogClose asChild>
                        <Button
                            className="text-white mt-auto font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500"
                            onClick={handleCheckIn}
                            disabled={loading}
                        >
                            {loading ? "Checking In..." : "Check In"}
                        </Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        </>
    );
}
