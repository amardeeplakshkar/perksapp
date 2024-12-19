import { NextResponse } from 'next/server';
import { prisma } from 'lib/prisma'; // Ensure your Prisma client is correctly imported
import { addDays, isSameDay } from 'date-fns';

export async function POST(req: Request) {
    try {
        const { telegramId } = await req.json();

        // Parse telegramId as an integer
        const parsedTelegramId = parseInt(telegramId, 10);

        if (isNaN(parsedTelegramId)) {
            return NextResponse.json({ error: 'Invalid request: telegramId must be a number' }, { status: 400 });
        }

        // Fetch user from the database
        const user = await prisma.user.findUnique({
            where: { telegramId: parsedTelegramId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const today = new Date();
        const { lastCheckInDate, checkInStreak, points, hasCheckedIn } = user;

        // If today is a new date and hasCheckedIn is true, reset it to false
        if (lastCheckInDate && !isSameDay(new Date(lastCheckInDate), today) && hasCheckedIn) {
            await prisma.user.update({
                where: { telegramId: parsedTelegramId },
                data: { hasCheckedIn: false },
            });
        }

        // Initialize variables for response
        let updatedStreak = 0;
        let earnedPoints = 100; // Default points for check-in

        // Check if the user has already checked in today
        if (hasCheckedIn && isSameDay(new Date(lastCheckInDate), today)) {
            return NextResponse.json({
                error: 'Already checked in today,\nTry again tomorrow!',
                streak: checkInStreak,
                points,
            }, { status: 400 });
        }

        // Update streak and points
        if (lastCheckInDate && isSameDay(addDays(new Date(lastCheckInDate), 1), today)) {
            updatedStreak = checkInStreak + 1;
            earnedPoints += 100 * updatedStreak; // Bonus points for streak
        } else {
            updatedStreak = 1;
        }

        const updatedPoints = points + earnedPoints;

        // Update user record in the database
        await prisma.user.update({
            where: { telegramId: parsedTelegramId },
            data: {
                lastCheckInDate: today,
                checkInStreak: updatedStreak,
                points: updatedPoints,
                hasCheckedIn: true, // Mark as checked in for today
            },
        });

        return NextResponse.json({
            message: 'Check-in successful',
            streak: updatedStreak,
            points: updatedPoints,
            earnedPoints,
        });
    } catch (error) {
        console.error('Error during check-in:', error);
        return NextResponse.json({ error: 'Failed to process check-in' }, { status: 500 });
    }
}
