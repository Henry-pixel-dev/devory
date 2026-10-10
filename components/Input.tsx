"use client";


import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";



type InputProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: string;
  apierrors?: string;
};

export default function Input({
  id, name, label, type = "text", placeholder, value, onChange, errors, apierrors,
}: InputProps) {


    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPassword && type === "password" ? "text" : type;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="w-full flex justify-between">
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-wide text-foreground/70"
        >
          {label}
        </label>
        {apierrors && (
          <Link href="/forget-password" className="text-sm text-blue-600 hover:text-blue-500">
            Forgot password?
          </Link>
        )}
      </div>
      <div className="relative">
          <input
            id={id}
            name={name}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full rounded-lg border border-primary/30 bg-background px-4 py-3 text-base text-foreground outline-none transition placeholder:text-foreground/40 hover:border-primary/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          { type === "password" && (
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary transition-colors hover:text-tertiary-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          )

          }
      </div>
      {errors && <p className="text-sm  text-light-error text-error">{errors}</p>}
    </div>
  );
}