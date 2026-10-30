"use client"

import { FiFilter } from "react-icons/fi";
import Input from "./Input";
import { useState, useEffect } from "react";
import RadioOption from "./Radio_Input";
import { useRouter, usePathname, useSearchParams } from "next/navigation"


export default function Resource_Fliter() {
    const pathname = usePathname()          // "/resources"
    const router = useRouter()
    const searchParams = useSearchParams()
    const [dateFilter, setDateFilter] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");

    function updateSearch(value: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (value) params.set("q", value)
        else params.delete("q")
        router.replace(`${pathname}?${params.toString()}`)
    }

    useEffect(() => {
            const timer = setTimeout(() => {
                const term = searchTerm.trim()
                if (term === (searchParams.get("q") ?? "")) return

                const params = new URLSearchParams(searchParams.toString())
                if (searchTerm) params.set("q", searchTerm)
                else params.delete("q")
                router.replace(`${pathname}?${params.toString()}`)
            }, 500)
 

        return () => clearTimeout(timer)
    }, [searchTerm])

  return (
    <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center space-x-4">
            <Input
            id="search"
            name="search"
            label="Search"
            type="search"
            placeholder="Search resources"
            hideLabel={true}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                type="button"
                aria-expanded={showFilters}
                onClick={() => setShowFilters((isVisible) => !isVisible)}
                className="flex items-center space-x-2 bg-tertiary/30 rounded-lg px-2 py-3"
            >
                <p className="text-foreground-primary text-sm md:text-base">Filter</p>
                <FiFilter className="text-sm text-primary md:text-base" />
            </button>
        </div>
        <div className="relative mt-2">
            <div className={`${showFilters ? "block" : "hidden"} absolute top-0 left-0 w-full z-50`}>
                <fieldset className="bg-background md:bg-tertiary/30  w-full flex flex-col gap-2 p-3 rounded-lg" aria-labelledby="fieldset-heading">
                    <h2 id="fieldset-heading" className=" text-sm text-foreground font-semibold">Filter by date</h2>
                    <RadioOption
                        name="date"
                        value="newest"
                        label="Newest"
                        checked={dateFilter === "newest"}
                        onChange={() => setDateFilter("newest")}
                    />
                    <RadioOption
                        name="date"
                        value="oldest"
                        label="Oldest"
                        checked={dateFilter === "oldest"}
                        onChange={() => setDateFilter("oldest")}
                    />
                </fieldset>
            </div>
        </div>
    </div>
  )
}
