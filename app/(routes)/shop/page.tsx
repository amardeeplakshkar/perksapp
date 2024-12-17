"use client"

import DynamicSVGIcon from 'components/icon'
import LogoHeader from 'components/LogoHeader'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'components/ui/accordion'
import { Card } from 'components/ui/card'
import { RainbowButton } from 'components/ui/rainbow-button'
import React, { useEffect, useState } from 'react'
import { useUserData } from 'components/hooks/useUserData';
import { Loader } from 'lucide-react';
import TelegramStar from 'components/TelegramStar'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti';


const gold = 'goldenrod'
const silver = 'silver'
const bronze = '#b56a2c'
const diamond = 'skyblue'

const Page = () => {
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

    const perkLevelMap = {
        'Diamond Perk': 'diamond',
        'Gold Perk': 'gold',
        'Silver Perk': 'silver',
        'Bronze Perk': 'bronze',
    };

    const handleSendInvoice = async (candidate: string, paymentAmount: number) => {
        setLoading(true);

        try {
            if (!webApp) {
                return <Loader />;
            }

            const telegramId = userId;

            // Map candidate to perkLevel
            const perkLevel = perkLevelMap[candidate];
            if (!perkLevel) {
                toast.error("Invalid perk level selected.");
                setLoading(false);
                return;
            }

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
                        webApp.showAlert("Paid successfully");

                        const triggerConfetti = () => {
                            const defaults = {
                                spread: 360,
                                ticks: 50,
                                gravity: 0,
                                decay: 0.94,
                                startVelocity: 30,
                                colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
                            };
                        
                            for (let i = 0; i < 3; i++) {
                                setTimeout(() => {
                                    confetti({
                                        ...defaults,
                                        particleCount: 40,
                                        scalar: 1.2,
                                        shapes: ["star"],
                                    });
                        
                                    confetti({
                                        ...defaults,
                                        particleCount: 10,
                                        scalar: 0.75,
                                        shapes: ["circle"],
                                    });
                                }, i * 100); 
                            }
                        };
                        
                        triggerConfetti();

                        const perkLevelResponse = await fetch('/api/update-perk-level', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ telegramId, perkLevel }),
                        });

                        const perkLevelData = await perkLevelResponse.json();

                        if (perkLevelData.success) {
                            toast.success("Perk level updated successfully!");
                        } else {
                            toast.error(`Failed to update perk level: ${perkLevelData.error}`);
                        }
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

    const disableButton = (level: string) => {
        if (user?.perkLevel === "diamond") return true;
        if (user?.perkLevel === "gold" && level !== "diamond") return true;
        if (user?.perkLevel === "silver" && !["diamond", "gold"].includes(level)) return true;
        if (user?.perkLevel === "bronze" && level === "bronze") return true;
        return false;
    };

    return (
        <>
            <section className="p-1">
                <LogoHeader header='Shop' icon='DuckShop' about='Boost Perks Points & Enjoy 100% TGE unlock' />
                <main className="grid grid-cols-2 gap-1">
                    {/* Diamond Perk */}
                    <Card className="flex flex-col justify-center items-center gap-2 p-4">
                        <DynamicSVGIcon color={diamond} size={"2.5rem"} />
                        <h3 className="font-semibold text-base">Diamond Perk</h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="diamond-perk">
                                <AccordionTrigger className="flex justify-between items-center bg-foreground/10 p-2 rounded-md text-xs">
                                    View Benefits
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="text-xs text-muted-foreground list-disc pl-5">
                                        <li>5x TGE allocation boost</li>
                                        <li>100% TGE unlock</li>
                                        <li>5x rewards per referral</li>
                                        <li>50% discount on daily check-in</li>
                                        <li>Exclusive access to premium perks</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <RainbowButton className="shine-effect w-full text-[.6rem] flex justify-center items-center text-white font-medium mt-2" onClick={() => handleSendInvoice('Diamond Perk', 199)} disabled={loading || disableButton('diamond')}>
                            {loading ? <Loader className='animate-spin' /> : <>
                                <TelegramStar />
                                199
                            </>}
                        </RainbowButton>
                    </Card>

                    {/* Gold Perk */}
                    <Card className="flex flex-col justify-center items-center gap-2 p-4">
                        <DynamicSVGIcon color={gold} size={"2.5rem"} />
                        <h3 className="font-semibold text-base">Gold Perk</h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="gold-perk">
                                <AccordionTrigger className="flex justify-between items-center bg-foreground/10 p-2 rounded-md text-xs">
                                    View Benefits
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="text-xs text-muted-foreground list-disc pl-5">
                                        <li>4x TGE allocation boost</li>
                                        <li>100% TGE unlock</li>
                                        <li>4x rewards per referral</li>
                                        <li>30% discount on daily check-in</li>
                                        <li>Priority support</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <RainbowButton className="shine-effect w-full text-[.6rem] flex justify-center items-center text-white font-medium mt-2" onClick={() => handleSendInvoice('Gold Perk', 169)} disabled={loading || disableButton('gold')}>
                            {loading ? <Loader className='animate-spin' /> : <>
                                <TelegramStar />
                                169
                            </>}
                        </RainbowButton>
                    </Card>

                    {/* Silver Perk */}
                    <Card className="flex flex-col justify-center items-center gap-2 p-4">
                        <DynamicSVGIcon color={silver} size={"2.5rem"} />
                        <h3 className="font-semibold text-base">Silver Perk</h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="silver-perk">
                                <AccordionTrigger className="flex justify-between items-center bg-foreground/10 p-2 rounded-md text-xs">
                                    View Benefits
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="text-xs text-muted-foreground list-disc pl-5">
                                        <li>3x TGE allocation boost</li>
                                        <li>100% TGE unlock</li>
                                        <li>3x rewards per referral</li>
                                        <li>20% discount on daily check-in</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <RainbowButton className="shine-effect w-full text-[.6rem] flex justify-center items-center text-white font-medium mt-2" onClick={() => handleSendInvoice('Silver Perk', 99)} disabled={loading || disableButton('silver')}>
                            {loading ? <Loader className='animate-spin' /> : <>
                                <TelegramStar />
                                99
                            </>}
                        </RainbowButton>
                    </Card>

                    {/* Bronze Perk */}
                    <Card className="flex flex-col justify-center items-center gap-2 p-4">
                        <DynamicSVGIcon color={bronze} size={"2.5rem"} />
                        <h3 className="font-semibold text-base">Bronze Perk</h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="bronze-perk">
                                <AccordionTrigger className="flex justify-between items-center bg-foreground/10 p-2 rounded-md text-xs">
                                    View Benefits
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="text-xs text-muted-foreground list-disc pl-5">
                                        <li>2x TGE allocation boost</li>
                                        <li>100% TGE unlock</li>
                                        <li>2x rewards per referral</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <RainbowButton className="shine-effect w-full text-[.6rem] flex justify-center items-center text-white font-medium mt-2" onClick={() => handleSendInvoice('Bronze Perk', 1)} disabled={loading || disableButton('bronze')}>
                            {loading ? <Loader className='animate-spin' /> : <>
                                <TelegramStar />
                                69
                            </>}
                        </RainbowButton>
                    </Card>
                </main>
            </section>
        </>
    );
};


export default Page