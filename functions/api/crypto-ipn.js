export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const payload = await request.json();

    console.log("NOWPayments IPN:", JSON.stringify(payload));

    const paymentStatus = payload.payment_status;
    const orderId = payload.order_id;
    const paymentId = payload.payment_id || payload.invoice_id || payload.id;

    if (!orderId) {
      return json({ error: "Missing order_id" }, 400);
    }

    const finalStatuses = ["finished", "confirmed", "sending"];

    const newStatus = finalStatuses.includes(paymentStatus)
      ? "paid"
      : paymentStatus === "failed" || paymentStatus === "expired"
        ? "failed"
        : "pending";

    await fetch(`${env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`, {
      method: "PATCH",
      headers: {
        "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        payment_status: newStatus,
        payment_method: "crypto"
      })
    });

    await fetch(`${env.SUPABASE_URL}/rest/v1/payments`, {
      method: "POST",
      headers: {
        "apikey": env.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        provider: "nowpayments",
        provider_payment_id: String(paymentId || ""),
        amount: Number(payload.price_amount || payload.actually_paid || 0),
        currency: payload.price_currency || payload.pay_currency || "USD",
        status: paymentStatus,
        raw_response: payload
      })
    });

    return json({ ok: true });

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