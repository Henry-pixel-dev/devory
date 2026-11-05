"use client";
import { useState } from "react";

export default function PayButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  }

  return (
    <button onClick={pay} disabled={loading}>
      {loading ? "Redirecting..." : "Pay with Crypto"}
    </button>
  );
}