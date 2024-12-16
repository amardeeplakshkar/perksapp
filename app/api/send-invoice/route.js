import { Telegraf } from 'telegraf';

const BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN;
const PROVIDER_TOKEN = process.env.NEXT_PUBLIC_PROVIDER_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

export async function POST(request) {
  const { telegramId, candidate } = await request.json();

  const prices = [{ label: 'XTR', amount: 1 }]; 

  try {
    const invoiceLink = await bot.telegram.createInvoiceLink({
      title: `${candidate} via ${telegramId}`,
      description: `Vote for ${candidate} in exchange for 1 Star.`,
      payload: `vote_${candidate}_payload`,
      provider_token: PROVIDER_TOKEN,
      currency: 'XTR',
      prices,
    });

    return new Response(JSON.stringify({ success: true, link: invoiceLink }), { status: 200 });
  } catch (error) {
    console.error('Error creating invoice link:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
