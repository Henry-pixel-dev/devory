import crypto from "crypto";

// usage: npx tsx --env-file=.env.local scripts/fake-webhook.ts <reference> <amount> [event_type]
const [, , reference, amount, type = "payment_link_completed"] = process.argv;

const payload = {
  event_id: "evt_" + crypto.randomBytes(6).toString("hex"),
  event_type: type,
  meta_data: {
    payment_link_refid: "test",
    payment_reference: reference,
    amount_required: Number(amount),
    amount_currency: "ngn",
    amount_received: "0.0001",
    amount_received_usd: Number(amount),
    overpaid_amount: "0", overpaid_amount_usd: 0,
    underpaid_amount: "0", underpaid_amount_usd: 0,
    token: "BTC", value: "0.0001", hash: "fakehash",
    status: type === "payment_link_failed" ? "failed" : "completed",
    network: "bitcoin", address: "test",
  },
  datetime: new Date().toISOString(),
};

const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv("aes-256-ctr", process.env.ROQQU_API_KEY!.substring(0, 32), iv);
const hash = Buffer.concat([cipher.update(JSON.stringify(payload)), cipher.final()]).toString("hex");

const res = await fetch("http://localhost:3000/api/webhook/roqqu", {
  method: "POST",
  headers: { "Content-Type": "application/json", "x-api-key": iv.toString("hex") },
  body: JSON.stringify({ hash }),
});
console.log(res.status, await res.text());