'use client';

import React, { useCallback, useEffect, useState } from 'react';
import TaskCard from "../../../components/TaskCard";
import { Card } from "../../../components/ui/card";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Separator } from "../../../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useRouter } from "next/navigation";
import { TASKS } from '../../../utils/tasks';
import { useTonConnectUI } from '@tonconnect/ui-react';
import toast from 'react-hot-toast';
import LogoHeader from 'components/LogoHeader';
import { FaAward, FaLink, FaTelegramPlane, FaTwitter, FaWallet } from 'react-icons/fa';
import { BsPeopleFill, BsTwitterX } from 'react-icons/bs';


const recipient = process.env.NEXT_PUBLIC_TON_WALLET_ADDRESS;

interface User {
    telegramId: string;
    username: string;
    firstName: string;
    completedTaskIds: string[];
    points?: number;
}

interface InitDataUnsafe {
    user?: User;
}

export default function Tasks() {
    const router = useRouter();
    const [userId, setUserId] = useState('');
    const [activeTab, setActiveTab] = useState("limited");
    const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [tonConnectUI] = useTonConnectUI();
    const [loadingTasks, setLoadingTasks] = useState<Record<string, boolean>>({});
    const [anyLoading, setAnyLoading] = useState(false);


    useEffect(() => {
        const initWebApp = async () => {
            if (typeof window !== 'undefined') {
                const WebApp = (await import('@twa-dev/sdk')).default;
                WebApp.ready();
                const userId = WebApp.initDataUnsafe.user?.id.toString() || '';
                setUserId(userId);

                // Fetch completed tasks
                if (userId) {
                    fetchCompletedTasks(userId);
                }
            }
        };

        initWebApp();
    }, []);

    const fetchCompletedTasks = async (userId: string) => {
        try {
            const response = await fetch(`/api/user?telegramId=${userId}`);
            const data = await response.json();

            if (response.ok) {
                setCompletedTasks(data.completedTaskIds.reduce((acc, taskId) => ({
                    ...acc,
                    [taskId]: true
                }), {}));
            }
        } catch (error) {
            console.error('Error fetching completed tasks:', error);
        }
    };

    const handleTaskComplete = () => {
        fetchCompletedTasks(userId);
    };


    const handleReferTask = () => {
        router.push("/friends")
    };
    const handleJoinPartnerTask = (taskId: string, taskReward: number, taskTitle: string, taskPath: string) => async () => {
        // Open the relevant partner channel link in a new tab
        window.open(taskPath, "_blank");

        // Check if user is defined
        if (!user) {
            console.error("User is not defined");
            return;
        }

        // Start loading state for the task
        setLoadingTasks((prev) => ({ ...prev, [taskId]: true }));
        setAnyLoading(true);

        try {
            // Call the API to complete the task and award points
            const response = await fetch("/api/complete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: String(userId),
                    taskId: taskId, // Task ID for the partner task
                    points: taskReward, // Points to be awarded for this task
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to complete partner task.");

            // Update the user points
            setUser((prevUser) => ({
                ...prevUser!,
                points: (prevUser?.points || 0) + taskReward,
            }));

            // Mark the task as completed
            setCompletedTasks((prev) => ({
                ...prev,
                [taskId]: true,
            }));

            toast.success(`${taskTitle} task completed and points added successfully! 🎉`);
        } catch (error: any) {
            console.error(`Failed to complete ${taskTitle} task:`, error);
            toast.error(error.message || `Failed to complete ${taskTitle} task. Please try again.`);
        } finally {
            setLoadingTasks((prev) => ({ ...prev, [taskId]: false }));
            setAnyLoading(false);
        }
    };

    const handleWalletConnectTask = useCallback(async () => {
        if (!tonConnectUI.connected) {
            router.push("/dashboard");
            toast.error("Connect Wallet First");
            return;
        }
        setIsLoading(true);
        try {

            const response = await fetch("/api/complete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: String(user!.telegramId), // Assuming `user` is already defined
                    taskId: "G07f1f77bcf86cd799439002", // Task ID for "Connect Wallet"
                    points: 5000 // Points to be awarded for the task
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed to complete wallet connect task.");

            setUser((prevUser) => ({
                ...prevUser!,
                points: (prevUser?.points || 0) + 5000
            }));

            setCompletedTasks((prev) => ({
                ...prev,
                "G07f1f77bcf86cd799439002": true,
            }));

            toast.success("Wallet connected and points added successfully! 🎉");

        } catch (error: any) {
            console.error("Failed to complete wallet connect task:", error);
            toast.error(error.message || "Failed to complete wallet connect task. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [tonConnectUI, router, user]);

    const handleTonTransaction = useCallback(async () => {
        if (!tonConnectUI.connected) {
            router.push("/dashboard");
            toast.error("Connect Wallet First");
            return;
        }

        setIsLoading(true);
        try {
            await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 60,
                messages: [
                    {
                        address: recipient,
                        amount: (0.5 * 1e9).toString(),
                    },
                ],
            });

            const response = await fetch("/api/complete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: String(userId),
                    taskId: 'L07f1f77bcf86cd799439001',
                    points: 20000,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to add points.");

            setUser((prevUser) => ({
                ...prevUser!,
                points: (prevUser?.points || 0) + 100000,
            }));
            toast.success("Transaction successful! 100,000 Peaks added 🎉");
        } catch (error: any) {
            console.error("Transaction failed:", error);
            toast.error(error.message || "Transaction failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [tonConnectUI, router, user]);

    const taskData = {
        limited: [
            {
                id: "L07f1f77bcf86cd799439001",
                icon: "ton",
                title: "Daily Check-In",
                reward: 20000,
                bg: 'bg-blue-500',
                bottom: 'border-b-2',
                img: true,
                onClick: handleTonTransaction,
            },
            {
                id: "L07f1f77bcf86cd799439002",
                icon: <span className="scale-125 h-[25px] w-[25px] flex justify-center items-center">😳</span>,
                title: "Mystery Quest",
                reward: 10000,
                status: "0/1",
                bg: "bg-foreground/10",
            },
        ],
        InGame: [
            {
                id: "G07f1f77bcf86cd799439001",
                icon: <FaTelegramPlane size={"1.5rem"} />,
                title: "Join Telegram",
                reward: 5000,
                bg: "bg-blue-500",
                onClick: handleJoinPartnerTask("G07f1f77bcf86cd799439001", 5000, "PERKS Community", "https://t.me/perkscommunity"),
            },
            {
                id: "G07f1f77bcf86cd799439002",
                icon: <FaWallet size={"1.5rem"} />,
                title: "Join Telegram",
                reward: 5000,
                bg: "bg-sky-500",
                onClick: handleWalletConnectTask
            },
            {
                id: "G07f1f77bcf86cd799439003",
                icon: <BsTwitterX size={"1.5rem"} />,
                title: "Follow on Twitter", 
                reward: 2000 , 
                onClick: handleJoinPartnerTask("G07f1f77bcf86cd799439003", 2000, "PERKS Twitter", "https://x.com/perkscommunity")
            },
            {
                id: "G07f1f77bcf86cd799439004",
                icon: <BsPeopleFill size={"1.5rem"} />,
                title: "Refer 10 Friends",
                reward: 5000,
                status: "1/1",
                onClick: handleReferTask, 
                bg: "bg-green-500"
            },
        ],
        partner: [
            {
                id: "P07f1f77bcf86cd799439201",
                icon: "blum",
                title: "Join Blum Channel",
                reward: 500,
                path: "https://t.me/blumcrypto",
                onClick: handleJoinPartnerTask("P07f1f77bcf86cd799439201", 500, "Join Blum Channel", "https://t.me/blumcrypto"),
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439202",
                icon: "cats",
                title: "Join Cats Channel",
                reward: 500,
                path: "https://t.me/cats_housewtf",
                onClick: handleJoinPartnerTask("P07f1f77bcf86cd799439202", 500, "Join Cats Channel", "https://t.me/cats_housewtf"),
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439203",
                icon: "xempire",
                title: "Join X Empire Channel",
                reward: 500,
                path: "https://t.me/notempire",
                onClick: handleJoinPartnerTask("P07f1f77bcf86cd799439203", 500, "Join X Empire Channel", "https://t.me/notempire"),
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439204",
                icon: "pavel-durov",
                title: "Join Du Rove's Channel",
                reward: 1000,
                path: "https://t.me/durov",
                onClick: handleJoinPartnerTask("P07f1f77bcf86cd799439204", 1000, "Join Du Rove's Channel", "https://t.me/blumcrypto"),
            },
        ]
    };

    return (
        <>
            <LogoHeader header="tasks" about={`earn perks for completing task`} icon='DuckMoney' />
            <Tabs defaultValue="limited" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-foreground/10">
                    <TabsTrigger className="capitalize" value="limited">limited</TabsTrigger>
                    <TabsTrigger className="capitalize" value="ingame">in-game</TabsTrigger>
                    <TabsTrigger className="capitalize" value="partner">Partner</TabsTrigger>
                </TabsList>
                <TabsContent value="limited">
                    <Card>
                        <ScrollArea className="h-[50dvh]">
                            {taskData.limited.map((task, index) => (
                                <div key={task.id || index}>
                                    <TaskCard task={task} completedTasks={completedTasks} />
                                    {index !== taskData.limited.length - 1 && <Separator />}
                                </div>
                            ))}
                        </ScrollArea>
                    </Card>
                </TabsContent>
                <TabsContent value="partner">
                    <Card>
                        <ScrollArea className="h-[50dvh]">
                            {taskData.partner.map((task, index) => (
                                <div key={task.id || index}>
                                    <TaskCard task={task} completedTasks={completedTasks} />
                                    {index !== taskData.partner.length - 1 && <Separator />}
                                </div>
                            ))}
                        </ScrollArea>
                    </Card>
                </TabsContent>
                <TabsContent value="ingame">
                    <Card>
                        <ScrollArea className="h-[50dvh]">
                            {taskData.InGame.map((task, index) => (
                                <div key={task.id || index}>
                                    <TaskCard task={task} completedTasks={completedTasks} />
                                    {index !== taskData.InGame.length - 1 && <Separator />}
                                </div>
                            ))}
                        </ScrollArea>
                    </Card>
                </TabsContent>
            </Tabs>
        </>
    );
}