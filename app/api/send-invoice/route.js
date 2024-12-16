import { Telegraf, Markup } from 'telegraf';

const BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN;
const PROVIDER_TOKEN = process.env.NEXT_PUBLIC_PROVIDER_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

// Function to create the voting menu
const votingKeyboard = () => {
  return Markup.inlineKeyboard(
    candidates.map((candidate) => [
      Markup.button.callback(`Vote for ${candidate}`, `vote_${candidate}`)
    ])
  );
};

// Function to create the "Pay" button for inline payments
const paymentKeyboard = () => {
  return Markup.inlineKeyboard([
    Markup.button.pay('Pay 1 XTR to Vote')
  ]);
};

// Command: /start
bot.start((ctx) => {
  ctx.reply(
    'Welcome! Vote for your favorite candidate by clicking the button below.',
    votingKeyboard()
  );
});


bot.on('pre_checkout_query', async (ctx) => {
  try {
    const { id, payload } = ctx.preCheckoutQuery;
    if (payload.startsWith('buy_')) {
      await ctx.answerPreCheckoutQuery({ ok: true });
    } else {
      await ctx.answerPreCheckoutQuery({ ok: false, error_message: 'Invalid payload' });
    }
  } catch (error) {
    console.error('Error during pre-checkout:', error);
    await ctx.answerPreCheckoutQuery({ ok: false, error_message: 'An error occurred, please try again later' });
  }
});



export async function POST(request) {
  try {
    const { telegramId, candidate } = await request.json();

    // Define the price for the candidate (1 XTR for the candidate)
    const prices = [{ label: 'XTR', amount: 1 }];

    // Generate the invoice link
    const invoiceLink = await bot.telegram.createInvoiceLink({
      title: `${candidate}`,
      description: `Buy ${candidate} for ${prices[0].amount} Star.`,
      payload: `buy_${candidate}_payload`,  // Unique payload for tracking
      provider_token: PROVIDER_TOKEN,
      currency: 'XTR',
      prices,
      reply_markup: paymentKeyboard()
    });

    // Return the invoice link in the response
    return new Response(
      JSON.stringify({ success: true, link: invoiceLink }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating invoice link:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
