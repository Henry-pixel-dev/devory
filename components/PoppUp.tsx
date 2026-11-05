"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function PoppUp() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // 1. Check if the URL has ?upgrade=true
    const isOpen = searchParams.get("upgrade") === "true";

    // 2. If it's not in the URL, don't render anything
    if (!isOpen) return null;

    // 3. Clear the flag from the URL when closing
    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("upgrade");
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleUpgrade = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("upgrade");   // closes the promo
        params.set("pay", "true");  // opens the payment screen
        router.push(`${pathname}?${params.toString()}`);
    };

  return (
    <div className=" fixed w-full bottom-0 left-0  flex flex-col justify-center z-50 bg-background md:max-w-72">
        <div className="w-full h-32 relative">
            <button 
            onClick={handleClose}
            className="absolute top-2 right-2 text-primary-foreground cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <video
                  src="/hero.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
        </div>

        <div className="flex flex-col space-y-4 p-4">
            <h1 className="text-base font-bold">Unlock More Features</h1>
            <p className="text-sm">Upgrade your plan to access more resources and collections.</p>
            <button onClick={handleUpgrade} className="bg-primary text-secondary px-4 py-2 rounded w-full">Upgrade Now</button>
        </div>
    </div>
  )
}
