'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Heading from "../../../components/Heading";
import TaskCard from "../../../components/TaskCard";
import { Card } from "../../../components/ui/card";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Separator } from "../../../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { useRouter } from "next/navigation";
import { TASKS } from '../../../utils/tasks';
import { useTonConnectUI } from '@tonconnect/ui-react';
import toast from 'react-hot-toast';


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
          userId: String(user.telegramId),
          taskId: 'L07f1f77bcf86cd799439001',
          points: 100000,
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
                title: "TON Promote",
                reward: TASKS.TON_PROMOTE.points,
                bg: 'bg-blue-500',
                bottom: 'border-b-2',
                img: true,
                onClick: handleTonTransaction,
            },
            {
                id: "L07f1f77bcf86cd799439002",
                icon: <span className="scale-125 h-[25px] w-[25px] flex justify-center items-center">😳</span>,
                title: "Mystery Quest",
                reward: 1000000,
                status: "0/1",
                bg: "bg-foreground/10",
            },
        ],
        InGame: [
            { id: "G07f1f77bcf86cd799439001", icon: "dogs", title: "Complete Profile", reward: 5000, status: "0/1" },
            { id: "G07f1f77bcf86cd799439002", icon: "github", title: "Verify Email", reward: 3000, status: "1/1", onClick: () => router.push('/') },
            { id: "G07f1f77bcf86cd799439003", icon: "gitlab", title: "Join Telegram", reward: 2000, status: "calculating" },
            { id: "G07f1f77bcf86cd799439004", icon: "bitbucket", title: "Follow on Twitter", reward: 4000, status: "0/1" },
        ],
        partner: [
            {
                id: "P07f1f77bcf86cd799439214",
                icon: "blum",
                title: "Join Blum Channel",
                reward: 1000,
                path: "https://t.me/blumcrypto",
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439215",
                icon: "cats",
                title: "Join Cats Channel",
                reward: 1000,
                path: "https://t.me/blumcrypto",
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439216",
                icon: "xempire",
                title: "Join XEmpire Channel",
                reward: 1000,
                path: "https://t.me/blumcrypto",
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439217",
                icon: "Peaks",
                title: "Join Peaks Channel",
                reward: 1000,
                path: "https://t.me/blumcrypto",
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439218",
                icon: "tomarket",
                title: "Join tomarket Channel",
                reward: 1000,
                path: "https://t.me/blumcrypto",
                img: true,
            },
        ]
    };

    return (
        <>
            <Heading title="tasks" desc={`for completing task`} />
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