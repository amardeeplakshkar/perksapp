import { prisma } from '../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId, referrerId } = await request.json();

  if (!userId || !referrerId) {
    return NextResponse.json({ error: 'Missing userId or referrerId' }, { status: 400 });
  }

  try {
    // Check if the user (referee) already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: { telegramId: parseInt(userId) },
    });

    // If the user already exists, return without giving points
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists. No points awarded.' });
    }

    // Find the referrer by telegramId
    const referrer = await prisma.user.findUnique({
      where: { telegramId: parseInt(referrerId) },
    });

    // If referrer does not exist, return an error
    if (!referrer) {
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
    }

    // Create the new user and attach the referrer
    const newUser = await prisma.user.create({
      data: {
        telegramId: parseInt(userId),
        referredByTelegramId: referrer.telegramId,
        isNewUser: false, // Mark user as not new once referred
      },
    });

    // Add points to the referrer
    await prisma.user.update({
      where: { telegramId: referrer.telegramId },
      data: { points: { increment: 500 } }, // Award 500 points for successful referral
    });

    return NextResponse.json({
      success: true,
      newUser,
      referrerPoints: referrer.points + 500
    });
  } catch (error) {
    console.error('Error saving referral:', error);
    return NextResponse.json({ error: 'Failed to save referral' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    // Fetch the user and their referrals
    const user = await prisma.user.findUnique({
      where: { telegramId: parseInt(userId) },
      include: {
        referrals: {
          select: {
            telegramId: true,
            username: true,
            firstName: true,
            lastName: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      referrals: user.referrals.map(referral => ({
        username: referral.username,
        firstName: referral.firstName,
        lastName: referral.lastName,
        joinedAt: referral.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}