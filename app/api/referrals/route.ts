import { prisma } from '../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { userId, referrerId } = await request.json();

  if (!userId || !referrerId) {
    return NextResponse.json({ error: 'Missing userId or referrerId' }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { telegramId: parseInt(userId) },
    });

    if (existingUser) {
      if (!existingUser.referredByTelegramId && existingUser.isNewUser) {
        // Update existing user and award points to the referrer
        await prisma.$transaction([
          prisma.user.update({
            where: { telegramId: existingUser.telegramId },
            data: {
              referredByTelegramId: parseInt(referrerId),
              isNewUser: false,
            },
          }),
          prisma.user.update({
            where: { telegramId: parseInt(referrerId) },
            data: { points: { increment: 500 } },
          }),
        ]);

        return NextResponse.json({ message: 'Referral recorded for existing user.' });
      }

      return NextResponse.json({ message: 'User already exists. No points awarded.' });
    }

    // Find the referrer by telegramId
    const referrer = await prisma.user.findUnique({
      where: { telegramId: parseInt(referrerId) },
    })

    if (!referrer) {
      return NextResponse.json({ error: 'Referrer not found' }, { status: 404 });
    }

    // Create a new user and attach the referrer
    const newUser = await prisma.user.create({
      data: {
        telegramId: parseInt(userId),
        referredByTelegramId: referrer.telegramId,
        isNewUser: false,
      },
    });

    // Add points to the referrer
    if (referrer) {
      // Determine multiplier based on referrer's perkLevel
      let multiplier = 1; // Default multiplier
      switch (referrer.perkLevel) {
        case "bronze":
          multiplier = 2;
          break;
        case "silver":
          multiplier = 3;
          break;
        case "gold":
          multiplier = 4;
          break;
        case "diamond":
          multiplier = 5;
          break;
        // "none" defaults to 1 (no multiplier)
      }

      // Update referrer's points with multiplied amount
      await prisma.user.update({
        where: { telegramId: referrer.telegramId },
        data: { points: { increment: 500 * multiplier } },
      });
    }

    return NextResponse.json({ success: true, newUser, referrerPoints: 500 });
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
            photo_url: true,
            createdAt: true,
            photoUrl: true
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
        photoUrl: referral.photoUrl,
      })),
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}