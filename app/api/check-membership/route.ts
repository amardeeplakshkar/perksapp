import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const botToken = process.env.BOT_TOKEN; // Use server-side environment variable

    if (!botToken) {
        return NextResponse.json({ error: 'Telegram bot token is missing' }, { status: 500 });
    }

    const { telegramId, channelUsername } = await req.json();

    if (!telegramId || !channelUsername) {
        return NextResponse.json({ error: 'Invalid request: missing telegramId or channelUsername' }, { status: 400 });
    }

    try {
        // Construct the API URL
        const url = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${encodeURIComponent(channelUsername)}&user_id=${telegramId}`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Telegram API error:', response.status, errorData);
            return NextResponse.json(
                { error: `Telegram API error: ${response.statusText || 'Unknown error'}` },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (!data.ok) {
            return NextResponse.json({ error: `Telegram API error: ${data.description}` }, { status: 502 });
        }

        const status = data.result.status;
        const isMember = ['creator', 'administrator', 'member'].includes(status);

        return NextResponse.json({ isMember });
    } catch (error) {
        console.error('Error checking channel membership:', error);
        return NextResponse.json(
            { error: `An error occurred while checking channel membership: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
}
