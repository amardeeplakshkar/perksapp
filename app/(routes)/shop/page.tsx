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

const gold = 'goldenrod'
const silver = 'silver'
const bronze = '#b56a2c'
const diamond = 'skyblue'

const Page = () => {
    const [loading, setLoading] = useState(false);
    const { userId } = useUserData();
    const [webApp, setWebApp] = useState<any>(null);

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

    const handleSendInvoice = async (candidate: string) => {
        setLoading(true);
    
        try {
            if (!webApp) {
                return <Loader/>;
            }
    
            const telegramId = userId;
            const response = await fetch('/api/send-invoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ telegramId, candidate }),
            });
    
            const data = await response.json();
    
            if (data.success) {
                const link = data.link;
                webApp.openInvoice(link , (status) => {
                    if (status === "paid")
                        webApp.showAlert("paid sucessfully");
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
                        <RainbowButton className=" shine-effect w-full text-[.6rem] flex justify-center items-center text-white font-medium mt-2" onClick={() => handleSendInvoice('Diamond Perk')} disabled={loading}>
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
                        <RainbowButton className="shine-effect w-full text-[.6rem] flex justify-center items-center text-white font-medium mt-2" onClick={() => handleSendInvoice('Gold Perk')} disabled={loading}>
                            {loading ? <Loader className='animate-spin' /> : <>
                                <TelegramStar />
                                149
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
                        <RainbowButton className="shine-effect w-full text-[.6rem] flex justify-center items-center text-white font-medium mt-2" onClick={() => handleSendInvoice('Silver Perk')} disabled={loading}>
                            {loading ? <Loader className='animate-spin' /> : <>
                                <TelegramStar />
                                109
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
                                        <li>10% discount on daily check-in</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <RainbowButton className="shine-effect w-full text-[.6rem] flex justify-center items-center text-white font-medium mt-2" onClick={() => handleSendInvoice('Bronze Perk')} disabled={loading}>
                            {loading ? <Loader className='animate-spin' /> : <>
                                <TelegramStar />
                                69
                            </>}
                        </RainbowButton>
                    </Card>
                </main>
            </section>
        </>
    )
}

export default Page
