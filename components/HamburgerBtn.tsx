"use client"

import { useState } from "react";
import SideBar from "./SideBar";
import SignOutBtn from "./SIgnOutBtn";


export default function HamburgerBtn() {
  const [isOpen, setIsOpen] = useState(false);
    
  return (
    <div 
    className="relative w-full bg-background">
      <div className="px-6">
        <button onClick={() => setIsOpen(!isOpen)} className="bg-tertiary/30 p-4 rounded-xl flex flex-col items-center space-y-1">
            <div className="py-0.5 w-5  bg-primary rounded-lg"></div>
            <div className="self-start py-0.5 w-3  bg-primary rounded-lg"></div>
        </button>
      </div>
      <div className="absolute top-full left-4 w-full z-50 bg-background  ">
        {isOpen && (
          <div className="w-full min-h-screen flex flex-col items-center">
            <SideBar />
            <div className=" w-full h-full flex items-end justify-end pb-24 pr-3">
              <SignOutBtn />
          </div>
          </div>
        )}
      </div>
    </div>
  )
}
