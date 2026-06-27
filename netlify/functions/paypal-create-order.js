exports.handler = async function(event) {
  try {
    const { amount, ticketId, title } = JSON.parse(event.body);

    const base =
      process.env.PAYPAL_ENV === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const tokenResponse = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });

    const tokenData = await tokenResponse.json();

    const orderResponse = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: ticketId,
          description: title,
          amount: {
            currency_code: "USD",
            value: Number(amount).toFixed(2)
          }
        }]
      })
    });

    const orderData = await orderResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify(orderData)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};