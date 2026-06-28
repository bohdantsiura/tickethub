 export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    const amount = Number(body.amount || 0);
    const orderId = body.orderId || `TH-${Date.now()}`;
    const description = body.description || "TicketHub order";

    if (!amount || amount <= 0) {
      return json({ error: "Invalid amount" }, 400);
    }

    const response = await fetch("https://api.nowpayments.io/v1/invoice", {
      method: "POST",
      headers: {
        "x-api-key": env.NOWPAYMENTS_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        price_amount: amount,
        price_currency: "USD",
        order_id: orderId,
        order_description: description,
        ipn_callback_url: "https://tickethub-3ic.pages.dev/api/crypto-ipn",
        success_url: "https://tickethub-3ic.pages.dev/payment.html?crypto=success",
        cancel_url: "https://tickethub-3ic.pages.dev/payment.html?crypto=cancel"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return json({ error: "NOWPayments error", details: data }, 500);
    }

    return json({
      success: true,
      invoice_url: data.invoice_url,
      id: data.id,
      order_id: orderId,
      raw: data
    });

  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}