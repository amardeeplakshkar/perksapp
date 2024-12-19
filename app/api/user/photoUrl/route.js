import { NextResponse } from "next/server";
import { prisma } from "lib/prisma"; // Adjust this import based on your Prisma setup

// Handle POST requests to save photoUrl to the database
export async function POST(request) {
  try {
    const body = await request.json();
    const { telegramId, photoUrl } = body;

    if (!telegramId || !photoUrl) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Update the database with Prisma
    const user = await prisma.user.upsert({
      where: { telegramId: Number(telegramId) },
      update: { photoUrl: photoUrl },
      create: {
        telegramId: Number(telegramId),
        photoUrl: photoUrl,
        lastCheckInDate: null,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error updating photoUrl:", error);
    return NextResponse.json({ error: "Failed to update photoUrl" }, { status: 500 });
  }
}