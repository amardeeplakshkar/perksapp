"use client";
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Avatar, AvatarImage } from "components/ui/avatar";
import WordPullUp from "components/ui/word-pull-up";
import Globe from "components/ui/glob";
import RandomNumber from "components/RandomNumber";
import DotPattern from "components/ui/dot-pattern";
import { cn } from "lib/utils";
import { FaAward } from "react-icons/fa";
import { useRouter } from "next/navigation";
import confetti from 'canvas-confetti';
import toast from "react-hot-toast";


function CustomPaging() {
    const sliderRef = useRef(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visitedSlides, setVisitedSlides] = useState([0]);

    const router = useRouter();
    const [animateProgress, setAnimateProgress] = useState(false);
    const [randomValue, setRandomValue] = useState(0);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
            const value = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
            setRandomValue(value);
            localStorage.setItem('randomValue', value.toString());
        },[]);

    
    // Fetch user data
    useEffect(() => {
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
    
            const initDataUnsafe = tg.initDataUnsafe || { user };
    
            if (initDataUnsafe.user) {
                fetch('/api/user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(initDataUnsafe.user),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.error) {
                            setError(data.error);
                        } else {
                            setUser(data || {});
    
                            // Pass the `telegramId` directly to `fetchLeaderboard`
                        }
                        setLoading(false);
                    })
                    .catch((err) => {
                        setError('Failed to fetch user data: ' + err.message);
                        setLoading(false);
                    });
                } else {
                    setError('No user data available');
                    setLoading(false);
                }
            } else {
                setError('This app should be opened in Telegram');
                setLoading(false);
            }
        }, []);

    const handleSlideChange = (oldIndex, newIndex) => {
        setCurrentSlide(newIndex);
    };

    const handleNextSlide = () => {
        sliderRef.current?.slickNext();
    };

    const settings = {
        customPaging: function (i) {
            const isCurrent = i === currentSlide;
            const isVisited = visitedSlides.includes(i);
            const bgColor = isCurrent ? "bg-white" : "bg-white/10";
            return (
                <div className={`h-2 w-[4rem] rounded-md flex items-center justify-center text-sm font-medium ${bgColor}`}></div>
            );
        },
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: handleSlideChange,
        afterChange: (current) => {
            setCurrentSlide(current);
            setVisitedSlides((prev) => (prev.includes(current) ? prev : [...prev, current]));
        },
        appendDots: (dots) => (
            <>
                <div className="absolute top-0 p-3 grid justify-center items-center w-full">
                    <ul className="flex gap-2">{dots}</ul>
                </div>
            </>
        ),
    };

    const handleClaimPoints = async () => {
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

        try {
            const response = await fetch('/api/claim-points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    telegramId: user?.telegramId,
                    points: randomValue + 527,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(`🎉 Points claimed! You now have ${data.user.points} points.`);
                router.push("/dashboard");
            } else {
                toast.error(data.error || 'Something went wrong.');
                router.push("/dashboard");
            }
        } catch (err) {
            console.error('Error claiming points:', err);
            toast.error('Failed to claim points.');
            router.push("/dashboard");
        }
    };


    return (
        <div className="relative overflow-hidden w-dvw max-h-dvh">
            <Globe className="absolute -bottom-[13rem]" />
            <Slider ref={sliderRef} {...settings}>
                {/* Slide 1 */}
                <div className="relative flex flex-col items-center justify-center py-4 h-dvh">
                    <div className="px-4 py-4">
                        {currentSlide === 0 && (<>
                            <WordPullUp className="uppercase text-gray-500 text-xs" words="Congratulations" />
                            <br />
                            <WordPullUp className="flex  items-center text-3xl font-bold my-2 uppercase" words={`Notcoin ERA`} >
                                <Avatar>
                                    <AvatarImage src="https://res.cloudinary.com/duscymcfc/image/upload/f_auto,q_auto/v1/perks/notcoin" />
                                </Avatar>
                            </WordPullUp>
                            <div className="text-xl font-semibold uppercase">
                                <WordPullUp className="text-white/75" words="You may have" />
                                <WordPullUp words="got nothing " /><br />
                                <WordPullUp className="text-sm text-white/75" words={`Telegram's first and most rewarding airdrop to users`} />
                            </div>
                        </>)}
                    </div>
                    <div className="flex justify-center mt-6">
                        <Avatar className="h-[6rem] w-[6rem]">
                            <AvatarImage src="https://res.cloudinary.com/duscymcfc/image/upload/f_auto,q_auto/v1/perks/notcoin" />
                        </Avatar>
                    </div>
                    <h1 className="text-5xl font-bold text-center mt-4"><RandomNumber min={100} max={250} /> </h1>
                    <div className="absolute bottom-4 w-full flex justify-center">
                        <button
                            onClick={handleNextSlide}
                            className="mt-6 px-6 py-3 w-[85%] bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                        >
                            Nothing, Huh!
                        </button>
                    </div>
                </div>
                {/* Slide 2 */}
                <div className="relative flex flex-col items-center justify-center py-4 h-dvh">
                    <div className="px-4 py-4">
                        {currentSlide === 1 && (<>
                            <WordPullUp className="uppercase text-gray-500 text-xs" words="Congratulations" />
                            <br />
                            <WordPullUp className="text-3xl font-bold my-2 uppercase" words="DOGS 🦴 ERA" />
                            <div className="text-xl font-semibold uppercase">
                                <WordPullUp className="text-white/75" words="That's More" />
                                <WordPullUp words="Dogs" /><br />
                                <WordPullUp className="text-sm -pt-2 text-white/75" words={`than 78% of other user's Allocation preety Good`} />
                            </div>
                        </>)}
                    </div>
                    <div className="flex justify-center mt-6">
                        <Avatar className="h-[6rem] w-[6rem]">
                            <AvatarImage src="https://res.cloudinary.com/duscymcfc/image/upload/f_auto,q_auto/v1/perks/dogs" />
                        </Avatar>
                    </div>
                    <h1 className="text-5xl font-bold text-center mt-4"><RandomNumber min={4500} max={6000} /> </h1>
                    <div className="absolute bottom-4 w-full flex justify-center">
                        <button
                            onClick={handleNextSlide}
                            className="mt-6 px-6 py-3 w-[85%] bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                        >
                            woof woof!!
                        </button>
                    </div>
                </div>
                {/* Slide 3 */}
                <div className="relative flex flex-col items-center justify-center py-4 h-dvh">
                    <div className="px-4 py-4">
                        {currentSlide === 2 && (<>
                            <WordPullUp className="uppercase text-gray-500 text-xs" words="Congratulations" />
                            <br />
                            <WordPullUp className="flex  items-center text-3xl font-bold my-2 uppercase" words={`X Empire ERA`} >
                                <Avatar>
                                    <AvatarImage src="https://res.cloudinary.com/duscymcfc/image/upload/f_auto,q_auto/v1/paws/xempire" />
                                </Avatar>
                            </WordPullUp>
                            <div className="text-xl font-semibold uppercase">
                                <WordPullUp className="" words={`Huge Community ecosystem`} /><br />
                                <WordPullUp className="text-sm text-white/75" words="You're part of a" />
                                <WordPullUp className="px-[-1rem] text-sm" words="dynamic and growing " />
                                <WordPullUp className="text-sm text-white/75" words="network Under Ton" />
                            </div>
                        </>)}
                    </div>
                    <div className="flex justify-center mt-6">
                        <Avatar className="h-[6rem] w-[6rem]">
                            <AvatarImage src="https://res.cloudinary.com/duscymcfc/image/upload/f_auto,q_auto/v1/paws/xempire" />
                        </Avatar>
                    </div>
                    <h1 className="text-5xl font-bold text-center mt-4"> <RandomNumber min={800} max={1100} /></h1>
                    <div className="absolute bottom-4 w-full flex justify-center">
                        <button
                            onClick={handleNextSlide}
                            className="mt-6 px-6 py-3 w-[85%] bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                        >
                            Wow, let's go!!!
                        </button>
                    </div>
                </div>
                {/* Slider 4 */}
                <div className="relative flex flex-col items-center justify-center py-4 h-dvh">
                    <div className="px-4 py-4">
                        {currentSlide === 3 && (<>
                            <WordPullUp className="uppercase text-gray-500 text-xs" words="here begins" />
                            <br />
                            <WordPullUp className="flex  items-center text-3xl font-bold my-2 uppercase" words={`PERKS ERA`} >
                                <FaAward />
                            </WordPullUp>
                            <div className="text-xl font-semibold uppercase">
                                <WordPullUp className="" words="You're an active player" /> <br /> <WordPullUp className="text-sm text-white/75" words="Here are the perks" />
                                <WordPullUp className="text-sm" words="earned from all your activities" />
                               
                            </div>
                        </>)}
                    </div>
                    <div className="flex justify-center mt-6">
                        <FaAward size={"5rem"} />
                    </div>
                    <h1 className="text-5xl flex justify-center items-center font-bold text-center mt-4">{randomValue} <span className="text-sm p-1 font-semibold">PERKS</span> </h1>
                    <div className="absolute bottom-4 w-full flex justify-center">
                        <button
                            onClick={handleClaimPoints}
                            className="mt-6 px-6 py-3 w-[85%] bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                        >
                            Keep it up, let's go!!!
                        </button>
                    </div>
                </div>
            </Slider>
            <DotPattern
                className={cn(
                    "[mask-image:radial-gradient(150px_circle_at_center,white,transparent)]",
                )}
            />
        </div>
    );
}

export default CustomPaging;
