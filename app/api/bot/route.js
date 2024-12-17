export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { Bot, webhookCallback } from 'grammy';

const token = process.env.NEXT_PUBLIC_BOT_TOKEN;

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');

const bot = new Bot(token);

bot.on('pre_checkout_query', (ctx) => {
  return ctx.answerPreCheckoutQuery(true).catch(() => {
    console.error('answerPreCheckoutQuery failed');
  });
});

bot.on('successful_payment', async (ctx) => {
  const payload = ctx.message.successful_payment.invoice_payload;
  const candidate = payload.replace('buy_', '').replace('_payload', '');

  try {
    ctx.reply(`🎉 Purchase Successful! You Have Upgraded to  ${candidate} Level!`);
  } catch (error) {
    console.error('Error saving payment:', error);
    ctx.reply('⚠️ There was an issue recording your payment. Please try again later.');
  }
});

export const POST = webhookCallback(bot, 'std/http');
