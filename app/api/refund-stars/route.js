import axios from 'axios';

const BOT_TOKEN = process.env.NEXT_PUBLIC_BOT_TOKEN;

export async function POST(request) {
  try {
    // Parse request body
    const { paymentId } = await request.json();

    // Validate inputs
  

    // Refund payment using Telegram's API
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/refundStarPayment`, {
      user_id: 6102684114,
      telegram_payment_charge_id: paymentId,
    });

    if (response.data.ok) {
      return new Response(
        JSON.stringify({ success: true, message: 'Payment refunded successfully' }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to process refund' }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing refund:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
