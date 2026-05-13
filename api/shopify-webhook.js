export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const s = req.body;
    const phone = s.shipping_address?.phone || s.customer?.default_address?.phone;
    const first_name = s.shipping_address?.first_name || s.customer?.first_name;

    const payload = [{ phone: `+91${phone}`, first_name: first_name }];

    console.log("Sending:", JSON.stringify(payload));

    const r = await fetch(
      "https://outbound.reply.cx/api/v1/outbound/6M7bW3f8CngH072703062137xJI2dDEN/campaign/4ds6oNYRPd7z0905187986996uVWSK4j",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjo1MX0.O4gAw2o9ABNdUfredMhsbV5I-zPiuV0-1buqWOdgs9s"
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await r.json();
    console.log("Reply.cx:", JSON.stringify(result));
    return res.status(200).json({ ok: true, result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
