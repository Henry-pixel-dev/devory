import "server-only"; // run: npm i server-only. Build fails if a client component imports this file

const BASE = "https://service.roqqu.com/v1";

export type Customer = { email: string; first_name: string; last_name: string };

function authHeader(): Record<string, string> {
  const live = process.env.ROQQU_MODE === "live";
  return { [live ? "x-api-key" : "x-staging-api-key"]: process.env.ROQQU_API_KEY! };
}

export async function generateWallet(
  network: "trc20" | "bep20",
  customer: Customer
): Promise<string> {
  const res = await fetch(`${BASE}/wallets/generate-wallet`, {
    method: "POST",
    headers: { ...authHeader(), "Content-Type": "application/json" },
    body: JSON.stringify({ network, customer: JSON.stringify(customer) }),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || json?.status !== "success" || !json?.data?.address) {
    throw new Error(json?.message ?? `Roqqu error ${res.status}`);
  }
  return json.data.address as string;
}