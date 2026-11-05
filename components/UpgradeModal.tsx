"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { createClient } from "@/lib/supabase/client"; // your existing browser client

type Order = {
  id: string;
  address: string;
  network: "trc20" | "bep20";
  token: string;
  crypto_amount: number;
  expires_at: string;
  status: string;
};

const LABELS = {
  trc20: "TRON (TRC20)",
  bep20: "BNB Smart Chain (BEP20)",
} as const;

export default function UpgradeModal({ onPaid }: { onPaid?: () => void }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [copied, setCopied] = useState("");

  async function start(network: "trc20" | "bep20") {
    setLoading(true);
    setError("");
    const res = await fetch("/api/upgrade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ network }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Something went wrong");
    setOrder(data.order);
  }

  // Countdown
  useEffect(() => {
    if (!order) return;
    const tick = () =>
      setSecondsLeft(
        Math.max(0, Math.floor((new Date(order.expires_at).getTime() - Date.now()) / 1000))
      );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [order]);

  // Poll for payment. Row Level Security means users can only read their own orders.
  useEffect(() => {
    if (!order || order.status === "paid") return;
    const supabase = createClient();
    const t = setInterval(async () => {
      const { data } = await supabase
        .from("orders").select("status").eq("id", order.id).maybeSingle();
      if (data?.status && data.status !== order.status) {
        setOrder({ ...order, status: data.status });
        if (data.status === "paid") onPaid?.();
      }
    }, 5000);
    return () => clearInterval(t);
  }, [order, onPaid]);

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  }

  // Screen 1: pick a network
  if (!order) {
    return (
      <div>
        <h2>Upgrade to Pro</h2>
        <p>Pay with USDT. Choose a network:</p>
        <button disabled={loading} onClick={() => start("trc20")}>USDT on TRON (TRC20)</button>
        <button disabled={loading} onClick={() => start("bep20")}>USDT on BNB Chain (BEP20)</button>
        {error && <p role="alert">{error}</p>}
      </div>
    );
  }

  // Screen 2: paid
  if (order.status === "paid") {
    return <p>Payment confirmed. You're now on Pro!</p>;
  }

  // Screen 3: expired
  if (secondsLeft === 0) {
    return (
      <div>
        <p>This payment window has expired. Please don't send funds to this address.</p>
        <button onClick={() => setOrder(null)}>Start again</button>
      </div>
    );
  }

  // Screen 4: payment details
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div>
      <h2>Complete your payment</h2>
      <p>Time left: <strong>{mm}:{ss}</strong></p>

      <QRCodeSVG value={order.address} size={180} />

      <p>Network: <strong>{LABELS[order.network]}</strong></p>
      <p>
        Amount: <strong>{order.crypto_amount} {order.token.toUpperCase()}</strong>{" "}
        <button onClick={() => copy(String(order.crypto_amount), "amt")}>
          {copied === "amt" ? "Copied" : "Copy"}
        </button>
      </p>
      <p style={{ wordBreak: "break-all" }}>
        Address: <code>{order.address}</code>{" "}
        <button onClick={() => copy(order.address, "addr")}>
          {copied === "addr" ? "Copied" : "Copy"}
        </button>
      </p>

      <p>
        Send exactly {order.crypto_amount} {order.token.toUpperCase()} on{" "}
        <strong>{LABELS[order.network]}</strong> only. Sending on a different network will
        result in lost funds. If paying from an exchange, make sure the amount you send is
        enough after the withdrawal fee.
      </p>
      <p>Waiting for payment... this page updates automatically.</p>
    </div>
  );
}