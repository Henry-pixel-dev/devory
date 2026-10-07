"use client";

export default function Button() {
  return (
    <button 
        type="submit"
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5  text-base font-medium text-white transition-all duration-200 hover:bg-primary/85 hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60  "
        >
            Create Account
    </button>
  )
}
