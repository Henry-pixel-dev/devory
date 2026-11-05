import { supabaseAdmin } from "@/lib/supabase/admin";

export async function fulfilOrder(order: { id: string; user_id: string; product_id: string }) {
  // Examples, pick what fits your app:
  await supabaseAdmin.from("profiles").update({ plan: "pro" }).eq("id", order.user_id);
  await supabaseAdmin.from("purchases").insert({ user_id: order.user_id, product_id: order.product_id });
  await supabaseAdmin.rpc("add_credits", { uid: order.user_id, amount: 100 });
}