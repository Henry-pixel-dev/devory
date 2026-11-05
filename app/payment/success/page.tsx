"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // your existing browser client

function Status() {
  const ref = useSearchParams().get("ref");
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    if (!ref) return;
    const supabase = createClient();
    const timer = setInterval(async () => {
      const { data } = await supabase
        .from("orders").select("status").eq("reference", ref).maybeSingle();
      if (data) setStatus(data.status);
      if (data?.status === "paid") clearInterval(timer);
    }, 3000);
    return () => clearInterval(timer);
  }, [ref]);

  if (status === "paid") return <p>Payment confirmed. Thank you!</p>;
  if (status === "underpaid") return <p>We received less than the required amount. Please contact support.</p>;
  return <p>Waiting for blockchain confirmation... this can take a few minutes.</p>;
}

export default function SuccessPage() {
  return <Suspense><Status /></Suspense>;
}