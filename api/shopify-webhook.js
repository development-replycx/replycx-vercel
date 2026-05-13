export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const shopify = req.body;

    // Extract fields from Shopify payload
    const phone = shopify.shipping_address?.phone 
               || shopify.customer?.default_address?.phone;
    const first_name = shopify.shipping_address?.first_name 
                    || shopify.customer?.first_name;
    const last_name = shopify.shipping_address?.last_name;
    const email = shopify.email;
    const order_name = shopify.name;
    const total_price = shopify.total_price;
    const product = shopify.line_items?.[0]?.title;

    console.log("Received from Shopify:", { phone, first_name, email, order_name });

    // POST to Reply.cx
    const response = await fetch(
      "https://outbound.reply.cx/api/v1/outbound/6M7bW3f8CngH072703062137xJI2dDEN/campaign/4ds6oNYRPd7z0905187986996uVWSK4j",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjo1MX0.O4gAw2o9ABNdUfredMhsbV5I-zPiuV0-1buqWOdgs9s"
        },
        body: JSON.stringify({
          data: [{
            phone: phone,
            first_name: first_name,
            last_name: last_name,
            email: email,
            order_name: order_name,
            total_price: total_price,
            product: product
          }]
        })
      }
    );

    const result = await response.json();
    console.log("Reply.cx response:", result);
    return res.status(200).json({ ok: true, result });

  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
