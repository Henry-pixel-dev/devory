"use client";

import { FaBars, FaTimes  } from "react-icons/fa";
import { useState } from "react";
import LoginBtn from "./LoginBtn";


export default function Hamburger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div >
        <button
        onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        {isOpen && (
            <div className="absolute top-full left-0  bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-full min-h-screen z-50 flex flex-col space-y-2">
                <LoginBtn href="/signin" size="sm">Sign In</LoginBtn>
                <LoginBtn href="/signup" size="sm">Sign Up</LoginBtn>
            </div>
        )}
    </div>
  );
}

