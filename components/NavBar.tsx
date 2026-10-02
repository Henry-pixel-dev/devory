import  Link   from "next/link";
import Image from "next/image";
import logo from "../public/logo.png";
import SignInBtn from "./SIgnInBtn";
import SignUpBtn from "./SignUpBtn";
import dlogo from "../public/Dlogo.png";
import Hamburger from "./Hamburger";

export default function NavBar() {
  return (
    <nav className="relative w-full flex justify-between border-b border-gray-200 py-2 px-6">
        <Link href="/" className="flex items-center space-x-2">
            <Image
                src={dlogo}
                alt="Logo"
                width={50}
                height={50}
                placeholder="blur"
                quality={70}
            />
            <p className="text-2xl font-bold text-primary font-display">
                Devory
            </p>
        </Link>
        
        <div className=" space-x-3 items-center hidden md:flex">
            <SignInBtn />
            <SignUpBtn />
        </div>
        <div className="flex items-center md:hidden">
            <Hamburger />
        </div>
    </nav>
  )
}
