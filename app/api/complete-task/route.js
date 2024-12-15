import {prisma} from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userId, taskId, points } = await request.json(); 

    const telegramId = parseInt(userId, 10);
    if (isNaN(telegramId)) {
      return NextResponse.json({ error: 'Invalid user ID.' }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { telegramId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const taskCompleted = await prisma.taskCompletion.findFirst({
      where: { userId: user.id, taskId },
    });

    if (taskCompleted) {
      return NextResponse.json({ error: 'Task already completed.' }, { status: 400 });
    }

    if (typeof points !== 'number' || points <= 0) {
      return NextResponse.json({ error: 'Invalid points value.' }, { status: 400 });
    }

    await prisma.taskCompletion.create({
      data: { userId: user.id, taskId },
    });

    // Increment the user's points with the provided value
    await prisma.user.update({
      where: { id: user.id },
      data: { points: { increment: points } },
    });

    return NextResponse.json({
      success: true,
      message: `Task completed! You earned ${points} points.`,
    });
  } catch (error) {
    console.error('Error completing task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}