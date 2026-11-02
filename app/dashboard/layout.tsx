import Image from "next/image";
import Link from "next/link";
import dlogo from  "@/public/Dlogo.png"
import HamburgerBtn from "@/components/HamburgerBtn";
import { FiHome, FiLink, FiLayers, FiStar } from "react-icons/fi";
import FooterBtn from "@/components/FooterBtn";
import SideBar from "@/components/SideBar";
import SignOutBtn from "@/components/SIgnOutBtn";


export default function DashBoardLayout( {children} : { children : React.ReactNode } ) {
  return (
    <main className="w-full h-full flex flex-col md:flex-row  ">
        
        <aside className="hidden md:flex md:flex-col w-sm md:w-64 min-h-screen  border-r ">
          <header className="mb-6 px-6 py-3">
            <Link href="/dashboard" className="flex items-end space-x-2">
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
          </header>
          <SideBar />
          <div className=" w-full h-full flex items-end justify-end pb-24 pr-3">
              <SignOutBtn />
          </div>
      </aside>

      <nav className="w-full flex justify-between mt-6 md:hidden">
        <HamburgerBtn />
        <Link href="/profile" className="flex items-center pr-6 ">
          <Image
            src={dlogo}
            alt="Devory Logo"
            width={28}
            height={28}
            placeholder="blur"
            quality={70}
          />
        </Link>
      </nav>
      <section className="min-h-screen w-full flex flex-col items-start ">
        {children}
      </section>

      <footer className="bg-background fixed bottom-0 left-0 w-full p-3 flex flex-row justify-between z-50 md:hidden">
        <FooterBtn href="/dashboard" icon={FiHome}>
            Dashboard
        </FooterBtn>
        <FooterBtn href="/dashboard/collections" icon={FiLayers}>
            Collection
        </FooterBtn>
        <FooterBtn href="/dashboard/resources" icon={FiLink}>
            Resources
        </FooterBtn>
        <FooterBtn href="/dashboard/favorite" icon={FiStar}>
            Favorite
        </FooterBtn>
      </footer>
    </main>
  )
}
