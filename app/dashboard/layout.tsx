import Image from "next/image";
import Link from "next/link";
import dlogo from  "@/public/Dlogo.png"


export default function DashBoardLayout( {children} : { children : React.ReactNode } ) {
  return (
    <main className="w-full h-full flex md:flex-row  ">
        
        <aside className="w-sm md:w-64 min-h-screen  border-r ">
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
          <ul className="flex flex-col space-y-3">
              <li className="py-3 px-6  rounded-md
              hover:bg-secondary hover:border-b cursor-pointer">
                  <Link href="/dashboard" className="w-full text-bold">
                      Dashboard
                  </Link>
              </li> 
              <li className="py-3 px-6  rounded-md text-primary
              hover:bg-secondary hover:border-b cursor-pointer">
                  <Link href="/dashboard/resources" className="w-full text-bold">
                      Resources
                  </Link>
              </li> 
              <li className="py-3 px-6  rounded-md
              hover:bg-secondary hover:border-b cursor-pointer">
                  <Link href="/dashboard/collections" className="w-full text-bold">
                      Collections
                  </Link>
              </li> 
              <li className="py-3 px-6  rounded-md
              hover:bg-secondary hover:border-b cursor-pointer">
                  <Link href="/dashboard/favorite" className="w-full text-bold">
                      Favorite
                  </Link>
              </li> 
          </ul>
      </aside>
      <section className="min-h-screen w-full flex flex-col items-start ">
        {children}
      </section>
    </main>
  )
}
