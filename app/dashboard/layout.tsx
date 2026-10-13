import Link from "next/link";


export default function DashBoardLayout( {children} : { children : React.ReactNode } ) {
  return (
    <main className="w-full h-full flex md:flex-row  ">
        
        <aside className="w-sm md:w-64 min-h-screen  border-r pt-6">
          <ul className="flex flex-col space-y-3">
              <li className="p-3  rounded-md
              hover:bg-secondary cursor-pointer">
                  <Link href="/dashboard" className="w-full text-bold">
                      Dashboard
                  </Link>
              </li> 
              <li className="p-3  rounded-md text-primary
              hover:bg-secondary cursor-pointer">
                  <Link href="/dashboard/resources" className="w-full text-bold">
                      Resources
                  </Link>
              </li> 
              <li className="p-3  rounded-md
              hover:bg-secondary cursor-pointer">
                  <Link href="/dashboard/collections" className="w-full text-bold">
                      Collections
                  </Link>
              </li> 
              <li className="p-3  rounded-md
              hover:bg-secondary cursor-pointer">
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
