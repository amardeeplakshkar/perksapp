import DynamicSVGIcon from 'components/icon'
import LogoHeader from 'components/LogoHeader'
import Perks from 'components/Perks'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'components/ui/accordion'
import { Card } from 'components/ui/card'
import DotPattern from 'components/ui/dot-pattern'
import { RainbowButton } from 'components/ui/rainbow-button'
import React from 'react'
import { FaStar } from 'react-icons/fa6'

const gold = 'goldenrod'
const silver = 'silver'
const bronze = '#b56a2c'
const diamond = 'skyblue'

const page = () => {
    return (
        <>
            <section className="p-1">
                <LogoHeader header='Shop' icon='DuckShop' about='Boost Perks Points & Enjoy 100% TGE unlock' />
                <main className="grid grid-cols-2 gap-1">
                    {/* Diamond Perk */}
                    <Card className="flex flex-col justify-center items-center gap-2 p-4">
                        <DynamicSVGIcon color={diamond} size={"4rem"} />
                        <h3 className="font-semibold text-lg">Diamond Perk</h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="diamond-perk">
                                <AccordionTrigger className="flex justify-between items-center bg-foreground/10 p-2 rounded-md text-sm">
                                    View Benefits
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                                        <li>5x TGE allocation boost</li>
                                        <li>100% TGE unlock</li>
                                        <li>5x rewards per referral</li>
                                        <li>50% discount on daily check-in</li>
                                        <li>Exclusive access to premium perks</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <RainbowButton className="text-sm flex justify-center items-center text-white font-medium mt-2">
                            Buy 1.99 TON
                        </RainbowButton>
                    </Card>

                    {/* Gold Perk */}
                    <Card className="flex flex-col justify-center items-center gap-2 p-4">
                        <DynamicSVGIcon color={gold} size={"4rem"} />
                        <h3 className="font-semibold text-lg">Gold Perk</h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="gold-perk">
                                <AccordionTrigger className="flex justify-between items-center bg-foreground/10 p-2 rounded-md text-sm">
                                    View Benefits
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                                        <li>4x TGE allocation boost</li>
                                        <li>100% TGE unlock</li>
                                        <li>4x rewards per referral</li>
                                        <li>30% discount on daily check-in</li>
                                        <li>Priority support</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <RainbowButton className="text-sm flex justify-center items-center text-white font-medium mt-2">
                            Buy 1.49 TON
                        </RainbowButton>
                    </Card>

                    {/* Silver Perk */}
                    <Card className="flex flex-col justify-center items-center gap-2 p-4">
                        <DynamicSVGIcon color={silver} size={"4rem"} />
                        <h3 className="font-semibold text-lg">Silver Perk</h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="silver-perk">
                                <AccordionTrigger className="flex justify-between items-center bg-foreground/10 p-2 rounded-md text-sm">
                                    View Benefits
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                                        <li>3x TGE allocation boost</li>
                                        <li>100% TGE unlock</li>
                                        <li>3x rewards per referral</li>
                                        <li>20% discount on daily check-in</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <RainbowButton className="text-sm flex justify-center items-center text-white font-medium mt-2">
                            Buy 1.09 TON
                        </RainbowButton>
                    </Card>

                    {/* Bronze Perk */}
                    <Card className="flex flex-col justify-center items-center gap-2 p-4">
                        <DynamicSVGIcon color={bronze} size={"4rem"} />
                        <h3 className="font-semibold text-lg">Bronze Perk</h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="bronze-perk">
                                <AccordionTrigger className="flex justify-between items-center bg-foreground/10 p-2 rounded-md text-sm">
                                    View Benefits
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                                        <li>2x TGE allocation boost</li>
                                        <li>100% TGE unlock</li>
                                        <li>2x rewards per referral</li>
                                        <li>10% discount on daily check-in</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <RainbowButton className="text-sm flex justify-center items-center text-white font-medium mt-2">
                            Buy 0.69 TON
                        </RainbowButton>
                    </Card>
                </main>
            </section>
        </>
    )
}

export default page