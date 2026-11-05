import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateWallet } from "@/lib/roqqu";

const PRO_PRICE_USD = 10;          // change to your real price
const EXPIRY_MINUTES = 30;
const NETWORKS = { trc20: "usdt", bep20: "usdt" } as const;
type Network = keyof typeof NETWORKS;

export async function POST(req: Request) {
  // Who is paying? From the session, never from the request body.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { network } = (await req.json()) as { network?: string };
    if (network !== "trc20" && network !== "bep20") {
    return NextResponse.json({ error: "Unsupported network" }, { status: 400 });
}

  // Reuse an unexpired pending order so the user doesn't get a new address every click
  const { data: existing } = await supabaseAdmin
    .from("orders")
    .select("id, address, network, token, crypto_amount, expires_at, status")
    .eq("user_id", user.id)
    .eq("product_id", "pro")
    .eq("network", network)
    .eq("status", "pending")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return NextResponse.json({ order: existing });

  // Roqqu requires first_name and last_name
  const meta = user.user_metadata ?? {};
  const [first = "", ...rest] = String(meta.full_name ?? "").split(" ");
  const customer = {
    email: user.email!,
    first_name: meta.first_name ?? (first || "Customer"),
    last_name: meta.last_name ?? (rest.join(" ") || "User"),
  };

  let address: string;
  try {
    address = await generateWallet(network as Network, customer);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }

  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60_000).toISOString();

  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .insert({
      reference: randomBytes(10).toString("hex"),
      user_id: user.id,
      product_id: "pro",
      amount: PRO_PRICE_USD,
      currency: "usd",
      network,
      token: NETWORKS[network],
      address,
      crypto_amount: PRO_PRICE_USD, // 1 USDT = 1 USD
      expires_at: expiresAt,
      status: "pending",
    })
    .select("id, address, network, token, crypto_amount, expires_at, status")
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }

  return NextResponse.json({ order });
}