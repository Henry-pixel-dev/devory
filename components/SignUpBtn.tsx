import Link from "next/link";

export default function SIgnInBtn() {
  return (
    <Link href="/signin" className="bg-primary font-bold text-center text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300"> 
      Sign Up
    </Link>
  )
}
