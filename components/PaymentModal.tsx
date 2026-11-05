"use client"

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

type Network = "trc20" | "bep20";

type Order = {
    address: string;
    network: Network;
    token: string;
    crypto_amount: number;
    expires_at: string;
};

const LABELS: Record<Network, string> = {
    trc20: "TRON (TRC20)",
    bep20: "BNB Smart Chain (BEP20)",
};

const secondsUntil = (iso: string) =>
    Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 1000));

export default function PaymentModal() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [copied, setCopied] = useState("");

    // Countdown (hooks must stay above the early return)
    useEffect(() => {
        if (!order) return;
        const t = setInterval(() => setSecondsLeft(secondsUntil(order.expires_at)), 1000);
        return () => clearInterval(t);
    }, [order]);

    const isOpen = searchParams.get("pay") === "true";
    if (!isOpen) return null;

    const handleClose = () => {
        setOrder(null);
        setError("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("pay");
        router.push(`${pathname}?${params.toString()}`);
    };

    async function start(network: Network) {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ network }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Something went wrong");
                return;
            }
            setOrder(data.order);
            setSecondsLeft(secondsUntil(data.order.expires_at));
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function copy(text: string, key: string) {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(""), 1500);
    }

    const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const ss = String(secondsLeft % 60).padStart(2, "0");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto rounded bg-background p-5">
                <button onClick={handleClose} className="absolute top-3 right-3 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Screen 1: choose a network */}
                {!order && (
                    <div className="flex flex-col space-y-3">
                        <h1 className="text-base font-bold">Pay with USDT</h1>
                        <p className="text-sm">Choose a network:</p>
                        <button
                            disabled={loading}
                            onClick={() => start("trc20")}
                            className="bg-primary text-secondary px-4 py-2 rounded w-full disabled:opacity-50"
                        >
                            {loading ? "Generating..." : "USDT on TRON (TRC20)"}
                        </button>
                        <button
                            disabled={loading}
                            onClick={() => start("bep20")}
                            className="bg-primary text-secondary px-4 py-2 rounded w-full disabled:opacity-50"
                        >
                            {loading ? "Generating..." : "USDT on BNB Chain (BEP20)"}
                        </button>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                )}

                {/* Screen 2: expired */}
                {order && secondsLeft === 0 && (
                    <div className="flex flex-col space-y-3">
                        <p className="text-sm">
                            This payment window has expired. Please don&apos;t send funds to this address.
                        </p>
                        <button
                            onClick={() => setOrder(null)}
                            className="bg-primary text-secondary px-4 py-2 rounded w-full"
                        >
                            Start again
                        </button>
                    </div>
                )}

                {/* Screen 3: payment details */}
                {order && secondsLeft > 0 && (
                    <div className="flex flex-col space-y-3">
                        <h1 className="text-base font-bold">Complete your payment</h1>
                        <p className="text-sm">Time left: <strong>{mm}:{ss}</strong></p>

                        <div className="self-center bg-white p-2 rounded">
                            <QRCodeSVG value={order.address} size={140} />
                        </div>

                        <p className="text-sm">Network: <strong>{LABELS[order.network]}</strong></p>

                        <div className="text-sm flex items-center justify-between gap-2">
                            <span>
                                Amount: <strong>{order.crypto_amount} {order.token.toUpperCase()}</strong>
                            </span>
                            <button onClick={() => copy(String(order.crypto_amount), "amt")} className="underline">
                                {copied === "amt" ? "Copied" : "Copy"}
                            </button>
                        </div>

                        <div className="text-sm">
                            <p>Address:</p>
                            <code className="block break-all text-xs">{order.address}</code>
                            <button onClick={() => copy(order.address, "addr")} className="underline mt-1">
                                {copied === "addr" ? "Copied" : "Copy address"}
                            </button>
                        </div>

                        <p className="text-xs">
                            Send exactly {order.crypto_amount} {order.token.toUpperCase()} on{" "}
                            <strong>{LABELS[order.network]}</strong> only. Sending on a different network
                            will result in lost funds.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}