export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const { amount, ticketId, title } = await request.json();

    const base =
      env.PAYPAL_ENV === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    const auth = btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`);

    const tokenResponse = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return json({ error: "PayPal token error", details: tokenData }, 500);
    }

    const orderResponse = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: ticketId || `TH-${Date.now()}`,
            description: title || "TicketHub ticket",
            amount: {
              currency_code: "USD",
              value: Number(amount).toFixed(2)
            }
          }
        ]
      })
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      return json({ error: "PayPal order error", details: orderData }, 500);
    }

    return json(orderData);
  } catch (error) {
    return json({ error: error.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });
}