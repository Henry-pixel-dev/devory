import Link from 'next/link';


export default function SideBar() {
  return (
    <aside className="w-full ">
        <ul className="bg-background flex flex-col items-center space-y-3 md:items-start">
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
  )
}
