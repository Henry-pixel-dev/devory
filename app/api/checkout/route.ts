import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createPaymentLink } from "@/lib/roqqu";

export async function POST(req: Request) {
  // TODO 1: who is paying? Get the user from the session, never from the request body.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser(); // getUser() verifies the token; getSession() doesn't
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { productId } = await req.json();
  if (typeof productId !== "string") {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  // TODO 2: how much? Read the price from YOUR database.
  // Replace "products" with wherever your prices live.
  const { data: product } = await supabaseAdmin
    .from("products")
    .select("id, price, currency")
    .eq("id", productId)
    .single();
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const reference = randomBytes(10).toString("hex"); // 20 chars, valid for Roqqu

  // Roqqu requires first_name and last_name, so build them with fallbacks
  const meta = user.user_metadata ?? {};
  const [first = "", ...rest] = String(meta.full_name ?? "").split(" ");
  const customer = {
    email: user.email!,
    first_name: meta.first_name ?? (first || "Customer"),
    last_name: meta.last_name ?? (rest.join(" ") || "User"),
  };

  // TODO 3: save the order as "pending" BEFORE calling Roqqu
  const { data: order, error: insertErr } = await supabaseAdmin
    .from("orders")
    .insert({
      reference,
      user_id: user.id,
      product_id: product.id,
      amount: product.price,
      currency: (product.currency ?? "ngn").toLowerCase(),
      status: "pending",
    })
    .select()
    .single();
  if (insertErr || !order) {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  try {
    const link = await createPaymentLink({
      amount: Number(order.amount),
      reference,
      customer,
      currency: order.currency,
    });

    await supabaseAdmin
      .from("orders")
      .update({ payment_link: link.payment_link, roqqu_link_refid: link.refid })
      .eq("id", order.id);

    return NextResponse.json({ url: link.payment_link });
  } catch (e) {
    await supabaseAdmin.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}