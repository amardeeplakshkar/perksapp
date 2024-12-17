import { prisma } from '../../../lib/prisma'; 
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { telegramId, perkLevel } = await req.json();

        // Validate and parse telegramId to an integer
        if (!telegramId || isNaN(telegramId)) {
            return NextResponse.json(
                { success: false, error: 'Invalid telegramId. It must be an integer.' },
                { status: 400 }
            );
        }

        const parsedTelegramId = parseInt(telegramId, 10);

        const updatedUser = await prisma.user.update({
            where: { telegramId: parsedTelegramId },
            data: {
                perkLevel,
            },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Error updating perk level:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update perk level.' },
            { status: 500 }
        );
    }
}

export const runtime = 'nodejs'; 
