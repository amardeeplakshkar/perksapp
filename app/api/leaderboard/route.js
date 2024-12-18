// /pages/api/leaderboard.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(req) {
  try {
    // Fetch the top 10 users based on their points
    const topUsers = await prisma.user.findMany({
      orderBy: {
        points: 'desc',
      },
      take: 10,  // Limit to top 10 users
      select: {
        username: true,
        firstName: true,
        points: true,
        photo_url: true
      },
    });

    // Return the top users' data as a JSON response
    return NextResponse.json(topUsers);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
