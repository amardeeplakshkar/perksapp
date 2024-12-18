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
import DynamicSVGIcon from 'components/icon';
import { useUserData } from 'components/hooks/useUserData';


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
    const [activeTab, setActiveTab] = useState("limited");
    const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [tonConnectUI] = useTonConnectUI();
    const router = useRouter();
    const [anyLoading, setAnyLoading] = useState(false);
    const { userData } = useUserData()
    const [loadingTasks, setLoadingTasks] = useState<Record<string, boolean>>({});

    const handleTaskStart = (taskId: string) => {
        // Set the task as loading
        setLoadingTasks((prev) => ({ ...prev, [taskId]: true }));

        // Reset the loading state after 10 seconds
        setTimeout(() => {
            setLoadingTasks((prev) => ({ ...prev, [taskId]: false }));
        }, 10000);
    };

    const fetchUserData = async () => {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();

            const initDataUnsafe: InitDataUnsafe = tg.initDataUnsafe || {};
            if (initDataUnsafe.user) {
                try {
                    const response = await fetch("/api/user", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(initDataUnsafe.user),
                    });

                    if (!response.ok) {
                        throw new Error("Failed to fetch user data.");
                    }

                    const data = await response.json();
                    setUser(data);
                    setCompletedTasks(
                        data.completedTaskIds.reduce((acc, taskId) => {
                            acc[taskId] = true;
                            return acc;
                        }, {})
                    );
                } catch (err: any) {
                    console.error("Failed to fetch user data:", err.message);
                    toast.error(err.message || "Failed to fetch user data.");
                }
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleJoinPartnerTask = (taskId: string, taskReward: number, taskTitle: string, taskPath: string) => async () => {

        try {
            window.open(taskPath, "_blank");

            if (!user) {
                console.error("User is not defined");
                return;
            }

            // Call the API to complete the task and award points
            const response = await fetch("/api/complete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: String(user?.telegramId),
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

    const handleReferTask = (taskId: string, taskReward: number, referCount: number) => async () => {

        if (userData.referrals.length !== referCount) {
            router.push("/friends");
            toast.error(`Minimum ${referCount} Referrals are required`);
            return;
        }

        try {
            const response = await fetch("/api/complete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: String(user?.telegramId),
                    taskId: taskId,
                    points: taskReward
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed try again!");

            setUser((prevUser) => ({
                ...prevUser!,
                points: (prevUser?.points || 0) + taskReward,
            }));

            // Mark the task as completed
            setCompletedTasks((prev) => ({
                ...prev,
                [taskId]: true,
            }));

            toast.success(`Congratulations 🎉! To Hit ${referCount} Refers Milestone`);

        } catch (error: any) {
            console.error("Failed to complete:", error);
            toast.error(error.message || "Failed to complete");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLevelTask = async () => {

        if (userData.perkLevel === "none") {
            router.push("/shop");
            toast.error("Upgrade To Any Level First!");
            return;
        }

        try {
            const response = await fetch("/api/complete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: String(user?.telegramId),
                    taskId: "L07f1f77bcf86cd799439003",
                    points: 25000
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Failed try again!");

            setUser((prevUser) => ({
                ...prevUser!,
                points: (prevUser?.points || 0) + 25000
            }));

            setCompletedTasks((prev) => ({
                ...prev,
                "L07f1f77bcf86cd799439003": true,
            }));

            toast.success("Level Upgraded and points added successfully! 🎉");

        } catch (error: any) {
            console.error("Failed to complete:", error);
            toast.error(error.message || "Failed to complete");
        } finally {
            setIsLoading(false);
        }
    };

    const handleWalletConnectTask = useCallback(async () => {

        if (!tonConnectUI.connected) {
            router.push("/dashboard");
            toast.error("Connect Wallet First");
            return;
        }

        try {
            const response = await fetch("/api/complete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: String(user?.telegramId),
                    taskId: "G07f1f77bcf86cd799439002",
                    points: 5000
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

        try {
            const originalValue = 0.5 * 1e9; 

            let discountPercentage = 0; 
            switch (userData?.perkLevel) {
                case "silver":
                    discountPercentage = 20;
                    break;
                case "gold":
                    discountPercentage = 30;
                    break;
                case "diamond":
                    discountPercentage = 50;
                    break;
            }

            const discountedValue = originalValue * (1 - discountPercentage / 100);
            const discountedValueString = discountedValue.toString();
        
            await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 60,
                messages: [
                    {
                        address: recipient,
                        amount: discountedValueString,
                    },
                ],
            });

            const response = await fetch("/api/complete-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: String(user?.telegramId),
                    taskId: 'M07f1f77bcf86cd799439001',
                    points: 20000,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to add points.");
            setUser((prevUser) => ({
                ...prevUser!,
                points: (prevUser?.points || 0) + 20000
            }));

            setCompletedTasks((prev) => ({
                ...prev,
                "M07f1f77bcf86cd799439001": true,
            }));
            toast.success("Transaction successful! 20,000 Perks added 🎉");
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
                id: "M07f1f77bcf86cd799439001",
                icon: "ton",
                title: "Daily Check-In",
                reward: 20000,
                bg: 'bg-blue-500',
                bottom: 'border-b-2',
                img: true,
                onClick: handleTonTransaction,
            },
            {
                id: "L07f1f77bcf86cd799439003",
                icon: <DynamicSVGIcon color={""} size={"1rem"} />,
                title: "Upgrade Perk",
                reward: 25000,
                bg: 'bg-emerald-500/75',
                bottom: 'border-b-2',
                img: true,
                onClick: handleLevelTask,
                status: "limited"
            },
            // {
            //     id: "L07f1f77bcf86cd799439002",
            //     icon: <span className="scale-125 h-[25px] w-[25px] flex justify-center items-center">😳</span>,
            //     title: "Mystery Quest",
            //     reward: 10000,
            //     status: "0/1",
            //     bg: "bg-foreground/10",
            // },
        ],
        InGame: [
            {
                id: "G07f1f77bcf86cd799439001",
                icon: <FaTelegramPlane size={"1.5rem"} />,
                title: "PERKS Community",
                reward: 5000,
                bg: "bg-blue-500",
                onClick: handleJoinPartnerTask("G07f1f77bcf86cd799439001", 5000, "PERKS Community", "https://t.me/perkscommunity"),
            },
            {
                id: "G07f1f77bcf86cd799439002",
                icon: <FaWallet size={"1.5rem"} />,
                title: "Connect Wallet",
                reward: 5000,
                bg: "bg-sky-500",
                onClick: handleWalletConnectTask
            },
            {
                id: "G07f1f77bcf86cd799439003",
                icon: <BsTwitterX size={"1.5rem"} />,
                title: "Follow on Twitter",
                reward: 2000,
                onClick: handleJoinPartnerTask("G07f1f77bcf86cd799439003", 2000, "PERKS Twitter", "https://x.com/perkscommunity")
            },
            {
                id: "G07f1f77bcf86cd799439004",
                icon: <BsPeopleFill size={"1.5rem"} />,
                title: "Refer 5 Friends",
                reward: 1000,
                status: "1/1",
                onClick: handleReferTask("G07f1f77bcf86cd799439004", 1000, 5),
                bg: "bg-green-500"
            },
            {
                id: "G07f1f77bcf86cd799439005",
                icon: <BsPeopleFill size={"1.5rem"} />,
                title: "Refer 10 Friends",
                reward: 5000,
                status: "1/1",
                onClick: handleReferTask("G07f1f77bcf86cd799439005", 5000, 10),
                bg: "bg-violet-500"
            },
            {
                id: "G07f1f77bcf86cd799439006",
                icon: <BsPeopleFill size={"1.5rem"} />,
                title: "Refer 25 Friends",
                reward: 10000,
                status: "1/1",
                onClick: handleReferTask("G07f1f77bcf86cd799439006", 10000, 25),
                bg: "bg-gold-500"
            },
            {
                id: "G07f1f77bcf86cd799439007",
                icon: <BsPeopleFill size={"1.5rem"} />,
                title: "Refer 50 Friends",
                reward: 20000,
                status: "1/1",
                onClick: handleReferTask("G07f1f77bcf86cd799439007", 20000, 50),
                bg: "bg-diamond-500"
            },
        ],
        partner: [
            {
                id: "P07f1f77bcf86cd799439205",
                icon: "bums",
                title: "Bums",
                reward: 1500,
                onClick: handleJoinPartnerTask("P07f1f77bcf86cd799439205", 1500, "Bums", "https://t.me/bums?start=_tgr_fpR3jAUxZGRl"),
                img: true,
            },

            {
                id: "P07f1f77bcf86cd799439207",
                icon: "duckchain",
                title: "DuckChain",
                reward: 2000,
                img: true,
                path: "https://t.me/DuckChain_bot?start=_tgr_uaT1YcIyZDY9",
                onClick: handleJoinPartnerTask("P07f1f77bcf86cd799439207", 2000, "DuckChain", "https://t.me/DuckChain_bot?start=_tgr_uaT1YcIyZDY9"),
            },
            {
                id: "P07f1f77bcf86cd799439208",
                icon: "agent301",
                title: "Agent 301",
                reward: 500,
                path: "https://t.me/cats_housewtf",
                onClick: handleJoinPartnerTask("P07f1f77bcf86cd799439208", 500, "Agent 301", "https://t.me/Agent301Bot?start=_tgr_m18qvHFiNzA1"),
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439209",
                icon: "trumpempire",
                title: "Trump Empire",
                reward: 1000,
                path: "https://t.me/cats_housewtf",
                onClick: handleJoinPartnerTask("P07f1f77bcf86cd799439209", 1000, "Trump Empire", "https://t.me/TrumpsEmpireBot?start=_tgr_h9FpSN5hNWVl"),
                img: true,
            },

            {
                id: "P07f1f77bcf86cd799439211",
                icon: "starhash",
                title: "#StarHash",
                reward: 2500,
                path: "https://t.me/starshash_bot?start=_tgr_cC0FzUszMGI9",
                onClick: handleJoinPartnerTask("P07f1f77bcf86cd799439211", 2500, "#StarHash", "https://t.me/starshash_bot?start=_tgr_cC0FzUszMGI9"),
                img: true,
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
                                    <TaskCard task={task} completedTasks={completedTasks} taskLoading={loadingTasks[task.id]} />
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
                                    <TaskCard task={task} completedTasks={completedTasks} taskLoading={loadingTasks[task.id]} />
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
                                    <TaskCard task={task} completedTasks={completedTasks} taskLoading={loadingTasks[task.id]} />
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