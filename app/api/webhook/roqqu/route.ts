import { NextResponse } from "next/server";
import { decryptWebhook } from "@/lib/roqqu";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { fulfilOrder } from "@/lib/fulfil";

export const runtime = "nodejs";        // we use Node's crypto
export const dynamic = "force-dynamic";

const ok = () => NextResponse.json({ received: true });

export async function POST(req: Request) {
  const raw = await req.json().catch(() => null);
  const iv = req.headers.get("x-api-key");
  if (!raw?.hash || !iv) return NextResponse.json({ error: "bad request" }, { status: 400 });

  let event: any;
  try {
    event = decryptWebhook(raw.hash, iv);
  } catch {
    return NextResponse.json({ error: "cannot decrypt" }, { status: 400 });
  }

  const { event_id, event_type, meta_data: m } = event;

  // Only handle payment-link events here (token_received etc. are ignored)
  if (!String(event_type).startsWith("payment_link_")) return ok();

  // TODO 1: find the order by YOUR reference
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("reference", m.payment_reference)
    .maybeSingle();

  if (!order) {
    console.error("Webhook for unknown reference", m.payment_reference);
    return ok(); // 200 so Roqqu doesn't keep retrying; investigate from logs
  }

  // TODO 2: already paid? Then this is a duplicate webhook. Do nothing.
  if (order.status === "paid") return ok();

  if (event_type === "payment_link_completed" || event_type === "payment_link_completed_overpaid") {
    // TODO 3: verify the payment matches what YOU stored, not what the webhook claims
    const matches =
      Number(m.amount_required) === Number(order.amount) &&
      String(m.amount_currency).toLowerCase() === String(order.currency).toLowerCase();

    if (!matches) {
      await supabaseAdmin
        .from("orders")
        .update({ status: "needs_review", last_event_id: event_id, tx_hash: m.hash })
        .eq("id", order.id);
      console.error("Amount mismatch for order", order.id, m);
      return ok();
    }

    // TODO 4: mark paid atomically. The .in("status", ...) means only ONE
    // webhook can ever win this update, even if two arrive at the same time.
    const { data: claimed } = await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        paid_at: new Date().toISOString(),
        tx_hash: m.hash,
        last_event_id: event_id,
        amount_received_usd: m.amount_received_usd,
        overpaid_amount_usd: m.overpaid_amount_usd ?? 0,
      })
      .eq("id", order.id)
      .in("status", ["pending", "underpaid"])
      .select()
      .maybeSingle();

    if (!claimed) return ok(); // someone else already processed it

    // TODO 5: give the customer what they paid for (runs once)
    try {
      await fulfilOrder(claimed);
    } catch (e) {
      console.error("Fulfilment failed for order", claimed.id, e);
      await supabaseAdmin.from("orders").update({ status: "needs_review" }).eq("id", claimed.id);
    }
    // For overpaid events, overpaid_amount_usd is saved so you can refund/credit later.
  } else if (event_type === "payment_link_failed") {
    // TODO 6: underpaid or failed. Do NOT fulfil. Record it for follow-up.
    await supabaseAdmin
      .from("orders")
      .update({
        status: "underpaid",
        last_event_id: event_id,
        tx_hash: m.hash,
        underpaid_amount_usd: m.underpaid_amount_usd ?? 0,
      })
      .eq("id", order.id)
      .eq("status", "pending");
  }

  return ok();
}