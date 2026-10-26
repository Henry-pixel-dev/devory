"use client";

type buttonprop = {
  children: React.ReactNode;
  disabled?: boolean;
}


export default function Button({children, disabled}: buttonprop) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3.5  text-base font-medium text-white transition-all duration-200 hover:bg-primary/85 hover:scale-[1.01] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50  disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}
