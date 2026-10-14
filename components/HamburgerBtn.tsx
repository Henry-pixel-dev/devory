"use client"


export default function HamburgerBtn() {
    
  return (
    <button className="bg-tertiary/30 p-4 rounded-xl flex flex-col items-center space-y-1">
        <div className="py-0.5 w-5  bg-primary rounded-lg"></div>
        <div className="self-start py-0.5 w-3  bg-primary rounded-lg"></div>
    </button>
  )
}
