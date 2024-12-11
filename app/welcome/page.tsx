'use client'; // Required for Next.js app directory

import React, { useRef, useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaAward } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { Avatar, AvatarImage } from '../../components/ui/avatar';
import Globe from '../../components/ui/glob';

const WelcomeSlider = () => {
    const sliderRef = useRef(null);
    const [activeSlide, setActiveSlide] = useState(0);
    const [progress, setProgress] = useState(0);
    const totalSlides = 3; // Number of slides
    const slideDuration = 5000; // 5 seconds per slide
    const [dogsScore, setDogsScore] = useState(0);

    const router = useRouter();
    const [animateProgress, setAnimateProgress] = useState(false);
    const [randomValue, setRandomValue] = useState(0);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedValue = localStorage.getItem('randomValue');
        if (storedValue) {
            setRandomValue(parseInt(storedValue, 10));
        } else {
            const value = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
            setRandomValue(value);
            localStorage.setItem('randomValue', value.toString());
        }
    }, []);

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


    const fetchLeaderboard = async (telegramId) => {
        const apiUrl = `https://api.onetime.dog/leaderboard?user_id=${telegramId}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseData = await response.json();
            const userScore = responseData["me"].score;
            console.log('Leaderboard Data:', userScore);
            setDogsScore(500);
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
        }
    };

    const telegramId = user?.telegramId;
    fetchLeaderboard(telegramId);


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


    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + 100 / (slideDuration / 100);
                } else {
                    if (activeSlide < totalSlides - 1) {
                        sliderRef.current?.slickNext();
                        return 0; // Reset progress for the next slide
                    }
                    return 100; // Keep the progress bar filled for the last slide
                }
            });
        }, 100);

        return () => clearInterval(interval);
    }, [activeSlide]);

    const handleSlideChange = (oldIndex, newIndex) => {
        setActiveSlide(newIndex);
        setProgress(0); // Reset progress for the new slide
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        swipe: false,
        beforeChange: handleSlideChange,
    };

    const handleNext = () => {
        sliderRef.current?.slickNext();
    };

    return (
        <div className="max-w-[100dvw] overflow-hidden bg-black text-white bg-[url('https://i.pinimg.com/originals/cf/ec/88/cfec8819d8376a57c86e3c6e53ed618e.gif')]">      
            <Globe className="absolute top-[70dvh] " />
            <div className="fixed top-0 left-0 w-full flex bg-gray-800">
                {Array.from({ length: totalSlides }).map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 rounded-md m-[0.1rem] transition-all ${index < activeSlide
                            ? 'bg-blue-500'
                            : index === activeSlide
                                ? 'bg-blue-500'
                                : 'bg-gray-800'
                            }`}
                        style={{
                            width: `${100 / totalSlides}%`,
                            transform: index === activeSlide ? `scaleX(${progress / 100})` : 'scaleX(1)',
                            transformOrigin: 'left',
                        }}
                    />
                ))}
            </div>

            <Slider ref={sliderRef} {...settings}>
                {/* Slide 1 */}
                <div className="flex flex-col items-center justify-center py-[1rem] relative h-dvh">
                    <div className="px-2">
                        <p className="uppercase text-muted-foreground/80 text-sm">Congratulations</p>
                        <h2 className="text-3xl font-bold my-1 uppercase">NOTCOIN ERA 🌟</h2>
                        <p className="text-xl font-semibold uppercase">
                            <span className="text-muted-foreground/50">You may have </span>
                            got nothing <br /> <span className="text-sm text-muted-foreground/50">Telegram's first and most rewarding airdrop to users</span>
                        </p>
                    </div>
                    <div className="flex justify-center bg-blend-multiply">
                        <Avatar className='h-[10rem] w-[10rem]'>
                            <AvatarImage src='https://res.cloudinary.com/duscymcfc/image/upload/f_auto,q_auto/v1/perks/notcoin' />
                        </Avatar>
                    </div>
                    <h1 className="text-5xl font-bold text-center mb-4">{(0).toLocaleString()}</h1>
                    <div className="absolute bottom-[2rem] w-full flex justify-center items-center">
                        <button
                            onClick={handleNext}
                            className="mt-6 px-6 py-3 w-[85%] bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                        >
                            Wow, let's go!!!
                        </button>
                    </div>
                </div>





                <div className="flex flex-col items-center justify-center py-[1rem] relative h-dvh">
                    <div className="px-2">
                        <p className="uppercase text-muted-foreground/80 text-sm">Congratulations</p>
                        <h2 className="text-3xl font-bold my-1 uppercase">Dogs Reward</h2>
                        <p className="text-xl font-semibold uppercase">

                            {dogsScore <= 100
                                ? <>
                                    <span className="text-muted-foreground/50">
                                        You&apos;re&nbsp;
                                    </span>
                                    a decent player&nbsp;
                                    <span className="text-muted-foreground/50">
                                        in Dogs.
                                    </span>
                                </>
                                :
                                <>
                                    <span className="text-muted-foreground/50">
                                        You&apos;re  &nbsp;
                                    </span>
                                    a Top Tier player &nbsp;
                                    <span className="text-muted-foreground/50">
                                        in Dogs.
                                    </span>
                                </>}
                        </p>
                        <p className="text-lg font-medium text-muted-foreground/80">
                            {dogsScore <= 100
                                ? <>You missed <span className='text-white'>a great opportunity</span>, but your allocation is <span className="text-white">decent</span>.</>
                                : <>You got <span className="text-white"> a great allocation</span> amount, keep up the <span className="text-white">great work!</span></>}
                        </p>
                    </div>
                    <div className="flex justify-center bg-blend-multiply">
                        <Avatar className='h-[10rem] w-[10rem]'>
                            <AvatarImage src='https://res.cloudinary.com/duscymcfc/image/upload/f_auto,q_auto/v1/perks/dogs' />
                        </Avatar>
                    </div>
                    <h1 className="text-5xl font-bold text-center mb-4">{(dogsScore).toLocaleString()}</h1>
                    <div className="absolute bottom-[2rem] w-full flex justify-center items-center">
                        <button
                            onClick={handleNext}
                            className="mt-6 px-6 py-3 w-[85%] bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                        >
                            Wow, let's go!!!
                        </button>
                    </div>
                </div>

                {/* Slide 2 */}
                <div className="flex flex-col items-center justify-center h-dvh py-[1rem] relative">
                    <div className="px-2">
                        <p className="uppercase text-muted-foreground/80 text-sm">Congratulations</p>
                        <h2 className="text-3xl font-bold my-1 uppercase">LEGEND ⭐</h2>
                        <p className="text-xl font-semibold uppercase">
                            <span className="text-muted-foreground/50">You&apos;re </span>
                            a top tier <br /> player <span className="text-muted-foreground/50">in Telegram <br /> mini apps</span>
                        </p>
                    </div>
                    <div className="flex justify-center bg-blend-multiply">
                        <FaAward size={'9rem'} />
                    </div>
                    <h1 className="text-5xl font-bold text-center mb-4">{(randomValue + 527).toLocaleString()}</h1>
                    <p className="text-center uppercase text-white/75 text-xs font-semibold">Total Rewards</p>
                    <div className="absolute flex justify-center bottom-[2rem] w-full">
                        <button
                            onClick={handleClaimPoints}
                            className="mt-6 px-6 py-3 w-[85%] bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                        >
                            Gotcha!
                        </button>
                    </div>
                </div>
            </Slider>
        </div>
    );
};

export default WelcomeSlider;
