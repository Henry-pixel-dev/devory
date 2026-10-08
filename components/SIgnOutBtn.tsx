"use client"

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";


export default function SignOutBtn() {
    const supabase = createClient()
    const router = useRouter()
    
    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) return;
        router.replace("/");
        router.refresh()
        };
  return (
    <button  
    onClick={handleSignOut}
    className="bg-primary text-primary-foreground hover:bg-primary/80  border border-primary px-4 py-2 rounded">
      Sign Out
    </button>
  )
}
