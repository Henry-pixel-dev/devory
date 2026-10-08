import  Link   from "next/link";
import Image from "next/image";
import logo from "../public/logo.png";
import LoginBtn from "./LoginBtn";
import dlogo from "../public/Dlogo.png";
import Hamburger from "./Hamburger";
import { createClient } from "@/lib/supabase/server";
import SignOutBtn from "./SIgnOutBtn";
import { revalidatePath } from 'next/cache';

export default async function NavBar() {

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser();
    
  return (
    <nav className="sticky top-0 z-50 bg-background/80 w-full flex justify-between border-b border-primary/50 py-2 px-6">
        <Link href="/" className="flex items-end space-x-2">
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
            { user ? 
                <SignOutBtn/>
            : (
            <>
                <LoginBtn href="/signin" size="sm" variant="primary">
                    Sign In
                </LoginBtn>
                <LoginBtn href="/signup" size="sm" variant="inverse">
                    Sign Up
                </LoginBtn>
            </>
            )}
        </div>
        <div className="flex items-center md:hidden">
            <Hamburger isLoggedIn={!!user}/>
        </div>
    </nav>
  )
}
