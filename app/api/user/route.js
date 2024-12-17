import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// GET user with completed tasks
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const telegramId = searchParams.get("telegramId");

    if (!telegramId) {
      return NextResponse.json(
        { error: "Invalid user data: telegramId is missing" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { telegramId: parseInt(telegramId) },
      include: {
        taskCompletions: true,
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Ensure taskCompletions is defined and is an array
    const completedTaskIds = user.taskCompletions
      ? user.taskCompletions.map((tc) => tc.taskId)
      : [];

    return NextResponse.json({
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      points: user.points,
      hasClaimedWelcomePoints: user.hasClaimedWelcomePoints,
      dailyPlays: user.dailyPlays,
      referredByTelegramId: user.referredByTelegramId, // Include referral info
      referrals: user.referrals.map((referral) => ({
        telegramId: referral.telegramId,
        username: referral.username,
        firstName: referral.firstName,
        lastName: referral.lastName,
        joinedAt: referral.createdAt,
      })),
      completedTaskIds,
      perkLevel: user.perkLevel, // Include perkLevel
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create or fetch a user
export async function POST(req) {
  try {
    const userData = await req.json();

    if (!userData || !userData.id) {
      return NextResponse.json(
        { error: "Invalid user data: telegramId is missing" },
        { status: 400 }
      );
    }

    const referrerId = userData.referrerId || null;

    let user = await prisma.user.findUnique({
      where: { telegramId: userData.id },
      include: { taskCompletions: true },
    });

    if (!user) {
      // New user creation logic
      user = await prisma.user.create({
        data: {
          telegramId: userData.id,
          username: userData.username || "",
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          photoUrl: userData.photoUrl || "",
          points: 0,
          hasClaimedWelcomePoints: false,
          dailyPlays: 0,
          referredByTelegramId: referrerId ? parseInt(referrerId) : null, // Attach referrer if provided
          perkLevel: "none", // Set default perkLevel
        },
      });

      if (referrerId) {
        const referrer = await prisma.user.findUnique({
          where: { telegramId: parseInt(referrerId) },
        });

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
          }

          await prisma.user.update({
            where: { telegramId: referrer.telegramId },
            data: { points: { increment: 500 * multiplier } },
          });
        }
      }
    } else if (userData.photoUrl) {
      user = await prisma.user.update({
        where: { telegramId: userData.id },
        data: { photoUrl: userData.photoUrl },
      });
    }

    // Ensure taskCompletions is defined and is an array
    const completedTaskIds = user.taskCompletions
      ? user.taskCompletions.map((tc) => tc.taskId)
      : [];

    return NextResponse.json({
      telegramId: user.telegramId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      points: user.points,
      hasClaimedWelcomePoints: user.hasClaimedWelcomePoints,
      dailyPlays: user.dailyPlays,
      referredByTelegramId: user.referredByTelegramId, // Include referral info
      completedTaskIds,
      perkLevel: user.perkLevel, // Include perkLevel
    });
  } catch (error) {
    console.error("Error processing user data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
