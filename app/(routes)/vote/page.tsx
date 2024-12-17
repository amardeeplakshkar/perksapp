"use client"

import LogoHeader from 'components/LogoHeader'
import TaskCard from '../../../components/TaskCard'
import { Avatar, AvatarImage } from '../../../components/ui/avatar'
import { Card } from '../../../components/ui/card'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useUserData } from 'components/hooks/useUserData'
import Loader from 'components/Loader'

const page = () => {

    const [loading, setLoading] = useState(false);
    const { userId } = useUserData();
    const [webApp, setWebApp] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initWebApp = async () => {
            try {
                if (typeof window !== 'undefined') {
                    const { default: WebApp } = await import('@twa-dev/sdk');
                    setWebApp(WebApp);
                    WebApp.ready();
                }
            } catch (error) {
                console.error('Error initializing WebApp:', error);
                toast.error('Failed to initialize WebApp.');
            } finally {
                setLoading(false);
            }
        };

        initWebApp();
    }, [userId]);

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

    const handleSendInvoice = async (candidate: string, paymentAmount: number) => {
        setLoading(true);

        try {
            if (!webApp) {
                return <Loader />;
            }

            const telegramId = userId;

            const response = await fetch('/api/send-invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ telegramId, candidate, paymentAmount }),
            });

            const data = await response.json();

            if (data.success) {
                const link = data.link;
                webApp.openInvoice(link, async (status) => {
                    if (status === "paid") {
                        webApp.showAlert("Voted Successfully");
                    }
                });
            } else {
                toast.error(`Failed to create invoice: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Something went wrong!');
        }
        setLoading(false);
    };


    const completedTasks = {
        "sx": true,
    };

    const voteTask = [
        {
            id: "1",
            icon: "tomarket",
            title: "Tomarket",
            reward: "",
        },
        {
            id: "2",
            icon: "cats",
            title: "Cats",
            reward: "",
        },
        {
            id: "3",
            icon: "xempire",
            title: "X Empire",
            reward: "",
        }
    ]

    return (
        <>
            <LogoHeader header='Voting' icon='DuckVote' about='Get Perks For Voting Projects' />
            <Tabs defaultValue='ongoing' className='w-full'>
                <TabsList className="grid w-full grid-cols-2 bg-foreground/10">
                    <TabsTrigger value='ongoing'>On Going</TabsTrigger>
                    <TabsTrigger value='completed'>Completed</TabsTrigger>
                </TabsList>
                <TabsContent value='ongoing'>
                    <Card className=' flex justify-center items-center flex-col'>
                        {voteTask.length === 0 ?
                            <>
                                <Avatar className='h-24 w-24 rounded-none'>
                                    <AvatarImage src='https://res.cloudinary.com/duscymcfc/image/upload/v1/perks/assets/duck404' className='' />
                                </Avatar>
                                <h2 className='font-semibold'>
                                    No On-Going Voting
                                </h2>
                            </>
                            :
                            <ScrollArea className='w-full h-[42dvh]'>
                                {
                                    voteTask.map((item) =>
                                        <div className='bg-white/5 rounded-lg mb-1' key={item.id}>
                                        <TaskCard task={
                                            {
                                                id: item.id,
                                                icon: item.icon,
                                                title: item.title,
                                                reward: item.reward,
                                                img: true,
                                                status: "vote",
                                                onClick: () => handleSendInvoice(item.title, 10)
                                            }
                                        }
                                        completedTasks={completedTasks}
                                        />
                                        </div> 
                                    )
                                }
                            </ScrollArea>
                        }
                    </Card>
                </TabsContent>
                <TabsContent value='completed'>
                    <Card>
                        <ScrollArea className=''>
                            <div className='bg-foreground/5 rounded-lg'>
                                <TaskCard
                                    completedTasks={completedTasks}
                                    task={{
                                        id: "sx",
                                        icon: "tomarket",
                                        title: "Tomarket",
                                        reward: "S01 Winner",
                                        img: true,
                                    }} />
                            </div>
                        </ScrollArea>
                    </Card>
                </TabsContent>
            </Tabs >
        </>
    )
}

export default page