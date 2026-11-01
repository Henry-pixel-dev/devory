"use client"


import { FaStar } from "react-icons/fa";
import { createClient } from "@/lib/supabase/client"
import {useRouter} from "next/navigation"
import { useState , useTransition } from "react";



export default function IsFavoriteButton({ is_favorite, userid, resourceid }: { is_favorite?: boolean, userid?: string, resourceid?: number }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [isPending, startTransition] = useTransition()
    

    const handleFavoriteClick = async () => {
        if(loading) return;


        const supabase =  createClient()

        try {
            setLoading(true);
            const {  error } = await supabase

                .from("resources")
                .update({ is_favorite: !is_favorite })
                .eq("id", resourceid)
                .eq("user_id", userid)

                if (error) {
                    console.error("Error updating favorite status:", error);
                    return;
                }

               startTransition(() => {
                    router.refresh()
                })
                
        } catch (error) {
            console.error("Error updating favorite status:", error);
        } finally {
            setLoading(false);
        }

    }

    const baseColor = is_favorite ? "text-yellow-500" : "text-tertiary/30";
  return (
    <button className="cursor-pointer disabled:cursor-not-allowed"  onClick={handleFavoriteClick}
    disabled={loading || isPending}>
        <FaStar className={` w-5 h-4 md:h-7 md:w-7 ${baseColor}`} />
    </button>
  )
}