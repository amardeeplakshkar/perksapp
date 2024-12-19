import { useState } from 'react';
import { useUserData } from './hooks/useUserData';
import toast from 'react-hot-toast';
import { Button } from './ui/button';
import { FaCoins } from 'react-icons/fa6';
import { Avatar } from './ui/avatar';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import confetti from 'canvas-confetti';

export default function CheckInComponent() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [streak, setStreak] = useState(null);
    const [points, setPoints] = useState(null);
    const { userId } = useUserData()

    const handleCheckIn = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/checkin', {
                method: 'POST',
                body: JSON.stringify({ telegramId: userId }),
            });
            const data = await response.json();

            if (data.error) {
                toast.error(data.error); // Show error toast
            } else {
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
                setStatus(data.message);
                setStreak(data.streak);
                setPoints(data.points);
                toast.success(data.message); // Show success toast
            }
        } catch (error) {
            toast.error('An error occurred while checking in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Card className="flex justify-between items-center border-0">
                <div className="flex gap-2 items-center">
                    <Avatar>

                        <div className={`flex justify-center items-center w-full`}>
                            <FaCoins />
                        </div>

                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-sm capitalize">Daily Check-In</h3>
                        <p className="text-xs text-muted-foreground">
                            100 PERKS / streak  
                        </p>
                    </div>
                </div>
                <Button
                    variant='nav'
                    className=" rounded-full text-[.65rem] h-7 font-semibold bg-blue-500 disabled:bg-gray-500"
                    onClick={handleCheckIn}
                    disabled={loading}
                >
                    {loading ? "Checking In..." : "Check In"}
                </Button>
            </Card>
            <Separator />
        </>
    );
}
